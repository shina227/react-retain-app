import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Role, type User } from '../generated/prisma/client.js';
import { AppError } from '../lib/AppError.js';
import { prisma } from '../lib/prisma.js';
import type { AuthUser } from '../types/express.js';
import type { LoginInput, RegisterInput } from '../validators/auth.js';

const BCRYPT_COST = 12;
const INVALID_CREDENTIALS = 'Invalid email or password';
// Compared against when the email is unknown, so both failure paths take the same time.
const DUMMY_HASH = '$2b$12$38fBkvQS09F1DPBS.Z.MOueZ4kuzBzNSc481x7ymySr2pTmgymjxi';

export type PublicUser = Omit<User, 'passwordHash' | 'updatedAt'>;

/** Strips private fields. Every user leaving this service goes through here. */
export const toPublicUser = ({ id, name, email, role, createdAt }: User): PublicUser => ({
  id,
  name,
  email,
  role,
  createdAt,
});

const signToken = (user: User) =>
  jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });

const authResponse = (user: User) => ({ token: signToken(user), user: toPublicUser(user) });

export async function register({ name, email, password }: RegisterInput) {
  if (await prisma.user.findUnique({ where: { email } })) {
    throw AppError.conflict('An account with that email already exists', 'EMAIL_TAKEN');
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, BCRYPT_COST), role: Role.USER },
  });
  return authResponse(user);
}

export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !valid) throw AppError.unauthorized(INVALID_CREDENTIALS, 'INVALID_CREDENTIALS');
  return authResponse(user);
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.unauthorized('Account no longer exists');
  return toPublicUser(user);
}

/** Verifies a JWT and returns its user, or throws 401. */
export function verifyToken(token: string): AuthUser {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
    if (typeof payload === 'string' || !payload.sub) throw new Error('Malformed payload');
    return { id: payload.sub, role: payload.role === Role.ADMIN ? Role.ADMIN : Role.USER };
  } catch {
    throw AppError.unauthorized('Invalid or expired token', 'INVALID_TOKEN');
  }
}
