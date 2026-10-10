import { rateLimit } from 'express-rate-limit';
import type { ApiErrorBody } from '../types/api.js';

// Slows down credential stuffing on login and register: 10 attempts per 15 minutes per IP.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: { message: 'Too many attempts, please try again later', code: 'RATE_LIMITED' },
  } satisfies ApiErrorBody,
});
