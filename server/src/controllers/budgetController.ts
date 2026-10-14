import type { RequestHandler } from 'express';
import * as budgetService from '../services/budgetService.js';

export const list: RequestHandler = async (req, res) => {
  res.json(await budgetService.listBudgets(req.user!.id));
};

export const get: RequestHandler<{ month: string }> = async (req, res) => {
  res.json(await budgetService.getBudget(req.user!.id, req.params.month));
};

export const set: RequestHandler<{ month: string }> = async (req, res) => {
  res.json(await budgetService.setBudget(req.user!.id, req.params.month, req.body));
};
