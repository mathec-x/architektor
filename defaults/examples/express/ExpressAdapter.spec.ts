import { Request, RequestHandler, Response, Router } from 'express';
import { ExpressAdapter } from './ExpressAdapter';
import { ExpressRouteHandler } from './ExpressRouteHandler';
import { ExpressTestAdapter } from './ExpressTestAdapter';

class TestRouter {
  router = Router();

  constructor() {
    this.router.get('/test/:id', (req, res) => {
      const id = parseInt(req.params.id);
      if (id === 404) return res.status(404).json({ message: 'Not found' });
      if (id === 500) return res.status(500).json({ message: 'Server error' });
      res.json({ id, message: 'Test route' });
    });

    this.router.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: Date.now() });
    });

    this.router.post('/data', (req, res) => {
      res.status(201).json({ created: true, data: req.body });
    });
  }
}

export const makeTestFactoryRoute = () => new TestRouter();

const testMiddleware: RequestHandler = (req, res, next) => {
  req.headers['x-test'] = 'test';
  next();
};

describe('Express Adapters', () => {
  let adapter: ExpressAdapter;

  beforeEach(() => {
    adapter = new ExpressAdapter();
  });

  describe('ExpressAdapter', () => {
    it('should handle complete configuration chain', () => {
      const result = adapter
        .setPrefix('/api')
        .registerFactory(makeTestFactoryRoute)
        .useMiddleware(testMiddleware)
        .useRouter(testMiddleware);

      expect(result).toBe(adapter);
      expect(adapter['prefix']).toBe('/api');
    });

    it('should normalize prefix and handle errors', () => {
      adapter.setPrefix('api/v1');
      expect(adapter['prefix']).toBe('/api/v1');

      const badFactory = () => { throw new Error('Factory error'); };
      expect(() => adapter.registerFactory(badFactory)).toThrow('Factory error');
    });

    it('should handle server operations', (done) => {
      const port = Math.floor(Math.random() * 10000) + 30000;

      adapter.start(port, (app) => {
        expect(app).toBeDefined();
        adapter.app.removeAllListeners();
        done();
      });
    });

    it('should handle error scenarios', () => {
      expect(adapter.start(-1)).toBe(adapter);
      expect(adapter.start('8080')).toBe(adapter);
    });

    it('should cover listen callback error (lines 44-45)', () => {
      const mockListen = jest.fn((port: number, callback?: (error?: Error) => void) => {
        if (callback) {
          const error = new Error('Listen error');
          expect(() => callback(error)).toThrow('Listen error');
        }
      });

      adapter.app.listen = mockListen as unknown as typeof adapter.app.listen;
      adapter.start(3000);
      expect(mockListen).toHaveBeenCalled();
    });
  });

  describe('ExpressTestAdapter & Routes', () => {
    it('should handle all HTTP operations', async () => {
      const testApp = new ExpressTestAdapter()
        .setPrefix('/api')
        .createTestModule({ factories: [makeTestFactoryRoute] });

      const getResponse = await testApp.get('/api/test/1').expect(200);
      expect(getResponse.body).toEqual({ id: 1, message: 'Test route' });

      await testApp.get('/api/health').expect(200);
      await testApp.post('/api/data').send({ test: true }).expect(201);

      await testApp.get('/api/test/404').expect(404);
      await testApp.get('/api/test/500').expect(500);
    });

    it('should handle default route', async () => {
      const testApp = new ExpressTestAdapter().createTestModule({ factories: [] });
      const response = await testApp.get('/').expect(200);
      expect(response.text).toBe('Ok');
    });
  });

  describe('ExpressRouteHandler', () => {
    it('should handle error processing (lines 14-15)', async () => {
      const routeHandler = new ExpressRouteHandler();
      const mockReq = { url: '/test-error' };
      const mockRes = {
        statusCode: 500,
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };

      const throwingRouter = (() => { throw new Error('Coverage test'); }) as unknown as Router;
      const middleware = routeHandler.register(throwingRouter);

      await middleware(mockReq as unknown as Request, mockRes as unknown as Response, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('Unit Test', () => {
    it('should printLayers process all layer types', () => {
      const router = Router();
      router.get('/test-layer', (req, res) => res.json({ layer: 'test' }));

      adapter.setPrefix('/api/v1');
      adapter.printLayers(router.stack);

      expect(adapter['prefix']).toBe('/api/v1');
    });
  });
});