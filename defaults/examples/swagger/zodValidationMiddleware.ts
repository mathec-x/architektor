import { HttpErrorHandler } from '@/adapters/http/errors/HttpErrorHandler';
import { LoggerService } from '@/application/services/logger/LoggerService';
import { type NextFunction, type Request, type Response } from 'express';
import z from 'zod';

interface ZodValidationMiddlewareProps {
  query?: z.ZodType
  params?: z.ZodType
  body?: z.ZodType,
}

export class ZodValidation {
  private readonly logger = new LoggerService(ZodValidation.name);

  middleware(schema: ZodValidationMiddlewareProps) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        let statusCode = 200;
        for (const key in schema) {
          if (['query', 'params', 'body'].includes(key)) {
            schema[key].parse(req[key]);
          }

          const meta = schema[key].meta();
          if (meta.statusCode) {
            statusCode = meta.statusCode;
          }
        }

        // i need to think about this
        // if (statusCode) {
        res.status(statusCode);
        // };

        next();
      } catch (err: any) {
        return new HttpErrorHandler().handle(req, res, err);
      }
    };
  };
};