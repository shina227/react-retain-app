import { Router } from 'express';
import { healthRouter } from './health.routes.js';

/** All API routes, mounted at /api. */
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
