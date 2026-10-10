import type { RequestHandler } from 'express';
import * as dashboardService from '../services/dashboardService.js';

export const get: RequestHandler = async (req, res) => {
  const { month } = req.query as { month: string };
  res.json(await dashboardService.getDashboard(req.user!.id, month));
};
