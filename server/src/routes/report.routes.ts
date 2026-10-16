import { Router } from 'express';
import * as reportController from '../controllers/reportController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { trendQuerySchema } from '../validators/report.js';

export const reportRouter = Router();

reportRouter.get(
  '/trend',
  requireAuth,
  validate({ query: trendQuerySchema }),
  reportController.trend,
);
