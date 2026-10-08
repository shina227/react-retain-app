import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const healthRouter = Router();

/** Liveness and database check. Also used by the client to wake the free-tier instance. */
healthRouter.get('/', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok', db: 'up', time: new Date().toISOString() });
});
