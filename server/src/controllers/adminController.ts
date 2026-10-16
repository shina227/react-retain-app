import type { RequestHandler } from 'express';
import * as adminService from '../services/adminService.js';
import type { AdminExpenseListQuery, AdminUserListQuery } from '../validators/admin.js';

export const insights: RequestHandler = async (_req, res) => {
  res.json(await adminService.getInsights());
};

export const users: RequestHandler = async (req, res) => {
  res.json(await adminService.listUsers(req.query as unknown as AdminUserListQuery));
};

export const expenses: RequestHandler = async (req, res) => {
  res.json(await adminService.listExpenses(req.query as unknown as AdminExpenseListQuery));
};
