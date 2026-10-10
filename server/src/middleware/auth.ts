import type { RequestHandler } from 'express';
import { Role } from '../generated/prisma/client.js';
import { AppError } from '../lib/AppError.js';
import { verifyToken } from '../services/authService.js';

// Requires a valid `Authorization: Bearer <jwt>` header and attaches `req.user`
export const requireAuth: RequestHandler = (req, _res, next) => {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) throw AppError.unauthorized();

  req.user = verifyToken(token);
  next();
};

// Must run after `requireAuth`. Signed-in non-admins get 403.
export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.user) throw AppError.unauthorized();
  if (req.user.role !== Role.ADMIN) throw AppError.forbidden();
  next();
};
