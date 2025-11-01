// create a custom lib? 
import { LoggerService } from '@/application/services/logger/LoggerService';
import { ZodValidation } from '@/infrastructure/http/middlewares/zodValidationMiddleware';
import { OpenAPIRegistry, ResponseConfig } from '@asteasolutions/zod-to-openapi';
import { Router, type RequestHandler } from 'express';
import { IHandlers, ISchema } from './OpenApiTypes';

function ucFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export class OpenApiAdapter {
  static readonly registry = new OpenAPIRegistry();
  private readonly logger = new LoggerService(OpenApiAdapter.name);
  private readonly zodValidation = new ZodValidation();
  readonly router = Router();

  route = {
    get: <Route extends string, Schema extends ISchema>(
      path: Route, schema: Schema, ...handlers: IHandlers<Route, Schema>[]): Router => {
      this.registerSchema(path, schema, 'get');
      return this.router.get(path, this.zodValidation.middleware(schema), ...handlers as RequestHandler[]);
    },
    post: <Route extends string, Schema extends ISchema>(
      path: Route, schema: Schema, ...handlers: IHandlers<Route, Schema>[]): Router => {
      this.registerSchema(path, schema, 'post');
      return this.router.post(path, this.zodValidation.middleware(schema), ...handlers as RequestHandler[]);
    },
    put: <Route extends string, Schema extends ISchema>(
      path: Route, schema: Schema, ...handlers: IHandlers<Route, Schema>[]): Router => {
      this.registerSchema(path, schema, 'put');
      return this.router.put(path, this.zodValidation.middleware(schema), ...handlers as RequestHandler[]);
    },
    delete: <Route extends string, Schema extends ISchema>(
      path: Route, schema: Schema, ...handlers: IHandlers<Route, Schema>[]): Router => {
      this.registerSchema(path, schema, 'delete');
      return this.router.delete(path, this.zodValidation.middleware(schema), ...handlers as RequestHandler[]);
    }
  };

  private registerSchema(path: string, schema: ISchema, method: 'get' | 'post' | 'put' | 'delete') {
    const res: Record<string, ResponseConfig> = {};
    let statusCode = 200;
    for (const key in schema) {
      const meta = schema[key].meta();
      const registerKey = meta.name + ucFirst(key);
      OpenApiAdapter.registry.register(registerKey, schema[key]);

      if (meta.statusCode) {
        statusCode = meta.statusCode;
      }

      this.logger.verbose(`Registrando schema ${registerKey} code: ${meta.statusCode}`);
    }

    res[statusCode] = {
      description: 'Ok',
      content: schema?.response && {
        'application/json': {
          schema: schema?.response
        }
      }
    };

    OpenApiAdapter.registry.registerPath({
      path: path,
      method: method,
      responses: {
        ...res,
        400: { description: 'Validation error' },
        404: { description: 'Resource not found' },
        409: { description: 'Duplicate resource' },
        500: { description: 'Internal server error' }
      },
      request: {
        query: schema.query as any,
        params: schema.params as any,
        body: schema.body && {
          description: 'body',
          content: {
            'application/json': {
              schema: schema.body
            }
          }
        }
      },
    });
  }
}
