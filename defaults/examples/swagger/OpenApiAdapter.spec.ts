/* eslint-disable @typescript-eslint/no-explicit-any */
import { extendZodWithOpenApi, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { z } from 'zod';
import { OpenApiAdapter } from './OpenApiAdapter';

extendZodWithOpenApi(z);

const userSchema = z
  .object({
    name: z.string(),
    email: z.email()
  })
  .meta({ name: 'User', statusCode: 201 });

const paramsSchema = z
  .object({ id: z.string() })
  .meta({ name: 'Params' });

const simpleSchema = z
  .object({ message: z.string() })
  .meta({ name: 'Simple' });

describe('OpenApiAdapter', () => {
  let adapter: OpenApiAdapter;

  beforeEach(() => {
    adapter = new OpenApiAdapter();
  });

  it('should create adapter with router', () => {
    expect(adapter).toBeInstanceOf(OpenApiAdapter);
    expect(adapter.router).toBeInstanceOf(Router);
  });

  it('should register complete CRUD routes and generate OpenAPI document', () => {
    const handler = (_req: any, res: any) => res.json({ success: true });

    adapter.route.post('/users', { body: userSchema, response: userSchema }, handler);
    adapter.route.get('/users', { response: userSchema }, handler);
    adapter.route.get('/users/:id', { params: paramsSchema, response: userSchema }, handler);
    adapter.route.put('/users/:id', { params: paramsSchema, body: userSchema, response: userSchema }, handler);
    adapter.route.delete('/users/:id', { params: paramsSchema }, handler);

    const generator = new OpenApiGeneratorV31(OpenApiAdapter.registry.definitions);
    const document = generator.generateDocument({
      openapi: '3.1.0',
      info: {
        title: 'Api',
        version: '1.0.0',
        description: 'Documentação'
      }
    });

    // console.log('components', inspect(document.components, { depth: null }));
    // console.log('paths', inspect(document.paths, { depth: null }));

    expect(document.openapi).toBe('3.1.0');
    expect(document.info.title).toBe('Api');
    expect(document.paths).toBeDefined();
    expect(document.components?.schemas).toBeDefined();

    expect(Object.keys(document.paths || {})).toHaveLength(2);

    expect(document.components?.schemas).toBeDefined();
    expect(Object.keys(document.components?.schemas || {})).toContain('UserBody');
    expect(Object.keys(document.components?.schemas || {})).toContain('UserResponse');
    expect(Object.keys(document.components?.schemas || {})).toContain('ParamsParams');

    expect(document.info.title).toBe('Api');
    expect(document.info.version).toBe('1.0.0');
    expect(document.info.description).toBe('Documentação');
  });

  describe('registerSchema method unit tests', () => {
    it('should handle schema with custom status code', () => {
      const registerSpy = jest.spyOn(OpenApiAdapter.registry, 'register');
      const registerPathSpy = jest.spyOn(OpenApiAdapter.registry, 'registerPath');

      (adapter as any).registerSchema('/test', { body: userSchema }, 'post');

      expect(registerSpy).toHaveBeenCalledWith('UserBody', userSchema);
      expect(registerPathSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          responses: expect.objectContaining({
            201: expect.objectContaining({
              description: 'Ok'
            })
          })
        })
      );

      registerSpy.mockRestore();
      registerPathSpy.mockRestore();
    });

    it('should handle schema without status code (default 200)', () => {
      const registerPathSpy = jest.spyOn(OpenApiAdapter.registry, 'registerPath');

      (adapter as any).registerSchema('/test', { response: simpleSchema }, 'get');

      expect(registerPathSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          responses: expect.objectContaining({
            200: expect.objectContaining({
              description: 'Ok'
            })
          })
        })
      );

      registerPathSpy.mockRestore();
    });

    it('should handle empty schema', () => {
      const registerSpy = jest.spyOn(OpenApiAdapter.registry, 'register');
      const registerPathSpy = jest.spyOn(OpenApiAdapter.registry, 'registerPath');

      (adapter as any).registerSchema('/empty', {}, 'get');

      expect(registerSpy).not.toHaveBeenCalled();
      expect(registerPathSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          request: expect.objectContaining({
            query: undefined,
            params: undefined,
            body: undefined
          })
        })
      );

      registerSpy.mockRestore();
      registerPathSpy.mockRestore();
    });
  });
});
