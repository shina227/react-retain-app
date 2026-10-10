import type { RequestHandler } from 'express';
import * as categoryService from '../services/categoryService.js';

export const list: RequestHandler = async (_req, res) => {
  res.json(await categoryService.listCategories());
};

export const listWithUsage: RequestHandler = async (_req, res) => {
  res.json(await categoryService.listCategoriesWithUsage());
};

export const create: RequestHandler = async (req, res) => {
  res.status(201).json(await categoryService.createCategory(req.body));
};

export const update: RequestHandler<{ id: string }> = async (req, res) => {
  res.json(await categoryService.updateCategory(req.params.id, req.body));
};

export const remove: RequestHandler<{ id: string }> = async (req, res) => {
  res.json(await categoryService.deleteCategory(req.params.id));
};
