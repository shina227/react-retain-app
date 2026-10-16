import type { RequestHandler } from 'express';
import * as reportService from '../services/reportService.js';
import type { TrendQuery } from '../validators/report.js';

export const trend: RequestHandler = async (req, res) => {
  const { month, months } = req.query as unknown as TrendQuery;
  res.json(await reportService.getTrend(req.user!.id, month, months));
};
