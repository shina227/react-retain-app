import type { RequestHandler } from 'express';
import * as adminService from '../services/adminService.js';

export const insights: RequestHandler = async (_req, res) => {
  res.json(await adminService.getInsights());
};
