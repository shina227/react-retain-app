import type { RequestHandler } from 'express';
import { AppError } from '../lib/AppError.js';

export const notFound: RequestHandler = (req) => {
  throw AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`, 'ROUTE_NOT_FOUND');
};
