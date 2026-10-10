import type { Role } from '../generated/prisma/client.js';

// The authenticated user, decoded from the JWT by `requireAuth`
export interface AuthUser {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
