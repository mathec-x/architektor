import { LoggerService } from '@/application/services/logger/LoggerService';
import { NextFunction, Request, Response, Router } from 'express';

// type ControllerFn = (req: Request) => Promise<any>;

export class ExpressRouteAdapter {
  private readonly logger = new LoggerService(ExpressRouteAdapter.name);

  register(fn: Router) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        this.logger.verbose('init');
        const result = await fn(req, res, next);
        this.logger.debug('result ok', result);
        res.status(200).json(result);
      } catch (err: any) {
        if (err.name === 'ValidationError') {
          return res.status(400).json({ error: err.message });
        }
        if (err.name === 'NotFoundError') {
          return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
  }
}