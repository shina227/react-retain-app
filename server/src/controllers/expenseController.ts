import type { RequestHandler } from 'express';
import * as expenseService from '../services/expenseService.js';
import type { ExpenseListQuery } from '../validators/expense.js';

// userId always comes from the verified token, never from the request body or params.

export const list: RequestHandler = async (req, res) => {
  res.json(
    await expenseService.listExpenses(req.user!.id, req.query as unknown as ExpenseListQuery),
  );
};

export const get: RequestHandler<{ id: string }> = async (req, res) => {
  res.json(await expenseService.getExpense(req.user!.id, req.params.id));
};

export const create: RequestHandler = async (req, res) => {
  res.status(201).json(await expenseService.createExpense(req.user!.id, req.body));
};

export const update: RequestHandler<{ id: string }> = async (req, res) => {
  res.json(await expenseService.updateExpense(req.user!.id, req.params.id, req.body));
};

export const remove: RequestHandler<{ id: string }> = async (req, res) => {
  await expenseService.deleteExpense(req.user!.id, req.params.id);
  res.status(204).end();
};
