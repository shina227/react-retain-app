import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { requireAuth } from '../middleware/auth.js';

export const categoryRouter = Router();

categoryRouter.get('/', requireAuth, categoryController.list);
