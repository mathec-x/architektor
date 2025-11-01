
import { LoggerService } from '@/application/services/logger/LoggerService';
import { NextFunction, Request, Response, Router } from 'express';

export class ExpressRouteHandler {
  private readonly logger = new LoggerService(ExpressRouteHandler.name);

  register(fn: Router) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        return await fn(req, res, next);
      } catch (err: Error | any) {
        this.logger.error(`Route '${req.url}' responds with error ${err?.message}`);

        if (err.name === 'ValidationError') {
          return res.status(400).json({ error: err.message });
        }
        if (err.name === 'NotFoundError') {
          return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });

      } finally {
        this.logger.debug(`Route '${req.url}' responds with code: ${res.statusCode}`);
      }
    };
  }
}