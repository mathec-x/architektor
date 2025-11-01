import { type RequestHandler } from 'express';
import { type RouteParameters } from 'express-serve-static-core';
import z from 'zod';

export interface ISchema {
  body?: z.ZodType,
  query?: z.ZodType,
  params?: z.ZodType,
  response?: z.ZodType,
}

export type IHandlers<Route extends string, Schema extends ISchema> =
  RequestHandler<
    RouteParameters<Route>,
    z.infer<Schema['response']>,
    z.infer<Schema['body']>,
    z.infer<Schema['query']>
  >
