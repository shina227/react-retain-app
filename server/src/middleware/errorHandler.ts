import type { ErrorRequestHandler, Response } from 'express';
import { ZodError, z } from 'zod';
import { isProduction } from '../config/env.js';
import { Prisma } from '../generated/prisma/client.js';
import { AppError } from '../lib/AppError.js';
import type { ApiErrorBody } from '../types/api.js';

const send = (res: Response, status: number, error: ApiErrorBody['error']) =>
  res.status(status).json({ error } satisfies ApiErrorBody);

const prismaErrors: Record<string, [status: number, message: string, code: string]> = {
  P2002: [409, 'A record with that value already exists', 'CONFLICT'],
  P2003: [409, 'Related record constraint failed', 'CONFLICT'],
  P2025: [404, 'Resource not found', 'NOT_FOUND'],
};

/** Maps every thrown error to a consistent `{ error: { message, code, details? } }` response. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return send(res, err.statusCode, { message: err.message, code: err.code });
  }

  if (err instanceof ZodError) {
    const { fieldErrors, formErrors } = z.flattenError(err);
    return send(res, 400, {
      message: formErrors[0] ?? 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: fieldErrors as Record<string, string[]>,
    });
  }

  // Malformed JSON body from express.json()
  if (err instanceof SyntaxError && 'body' in err) {
    return send(res, 400, { message: 'Malformed JSON body', code: 'INVALID_JSON' });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && prismaErrors[err.code]) {
    const [status, message, code] = prismaErrors[err.code]!;
    return send(res, status, { message, code });
  }

  console.error(err);
  return send(res, 500, {
    message: isProduction || !(err instanceof Error) ? 'Something went wrong' : err.message,
    code: 'INTERNAL_ERROR',
  });
};
