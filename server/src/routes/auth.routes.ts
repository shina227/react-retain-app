import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, profileSchema, registerSchema } from '../validators/auth.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  authLimiter,
  validate({ body: registerSchema }),
  authController.register,
);
authRouter.post('/login', authLimiter, validate({ body: loginSchema }), authController.login);
authRouter.get('/me', requireAuth, authController.me);
authRouter.patch('/me', requireAuth, validate({ body: profileSchema }), authController.updateMe);
