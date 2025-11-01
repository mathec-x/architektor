import { LoggerService } from '@/application/services/logger/LoggerService';
import { NotFoundException } from '@/core/exceptions/NotFoundException';
import { Request, Response } from 'express';

// run: npx tsna add prisma
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; 

// run: npx tsna add zod
// import z from 'zod'; // npx tsna add zod

export class HttpErrorHandler {

  constructor(
    public readonly logger = new LoggerService(HttpErrorHandler.name),
  ) { }

  handle(req: Request<any, any, any, any>, res: Response, err: any) {
    this.logger.error(`Route '${req.url}' responds with error ${err.message}`);

    // if (err instanceof z.ZodError) {
    //   return res.status(400).json({
    //     message: 'Invalid input',
    //     fieldErrors: z.prettifyError(err)
    //   });
    // }

    if (err instanceof NotFoundException) {
      return res.status(404).json({ message: err.message });
    }

    // if (err instanceof PrismaClientKnownRequestError) {
    //   switch (err.code) {
    //     case 'P2002':
    //       return res.status(409).json({ message: 'Duplicate resource' });
    //     case 'P2003':
    //       return res.status(404).json({ message: 'Related resource not found' });
    //     case 'P2011':
    //       return res.status(400).json({ message: 'Null constraint violation' });
    //     case 'P2012':
    //       return res.status(400).json({ message: 'Missing required field' });
    //     case 'P2014':
    //       return res.status(400).json({ message: 'Relation violation' });
    //     case 'P2025':
    //       return res.status(404).json({ message: 'Resource not found' });
    //   }
    // }

    res.status(err?.code || 500).json({ message: err?.message || 'Internal Server Error' });
  }
}