import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

interface RequestSchemas {
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
}

/**
 * Parses params, query and body with zod and replaces them with the parsed (typed, coerced) values.
 * ZodErrors are thrown and turned into 400 responses by the error handler.
 */
export const validate =
  (schemas: RequestSchemas): RequestHandler =>
  (req, _res, next) => {
    if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
    if (schemas.query) {
      // Express 5 exposes req.query as a getter, so it must be redefined rather than assigned.
      Object.defineProperty(req, 'query', {
        value: schemas.query.parse(req.query),
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    if (schemas.body) req.body = schemas.body.parse(req.body);
    next();
  };
