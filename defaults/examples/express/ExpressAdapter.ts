import express, { RequestHandler, Router } from 'express';
import { LoggerService } from '@/application/services/logger/LoggerService';
import { ExpressRouteHandler } from './ExpressRouteHandler';

export class ExpressAdapter {
  private readonly logger = new LoggerService(ExpressAdapter.name);
  private readonly routeAdapter = new ExpressRouteHandler();

  private prefix = '';
  public readonly app = express();

  constructor() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  registerFactory(factory: () => { router: Router }) {
    const factoryInstance = factory();
    this.app.use(this.prefix, this.routeAdapter.register(factoryInstance.router));
    setTimeout(() => this.printLayers(factoryInstance.router.stack));
    return this;
  }

  setPrefix(prefix: string) {
    this.prefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
    return this;
  }

  useRouter(...handlers: RequestHandler[]) {
    this.app.use(this.prefix, handlers);
    setTimeout(() => this.printLayers(this.app.router.stack));
    return this;
  }

  useMiddleware(handler: RequestHandler) {
    this.app.use(handler);
    return this;
  }

  start(port: number | string, callback?: (app: typeof this.app) => void) {
    try {
      this.app.listen(Number(port), (error) => {
        if (error) {
          this.logger.critical(error.message, { port });
          throw error;
        }
        this.logger.info('Environment:', process.env.NODE_ENV);
        this.logger.info('Server running on port', port);
        this.logger.info('Application Name:', process.env.APPLICATION_NAME);
        this.logger.verbose('Database URL:', process.env.DATABASE_URL);
        if (callback) {
          callback(this.app);
        }
      });
    } catch (error) {
      this.logger.critical(error, { port });
    }

    return this;
  }

  printLayers(layers: Router['stack']) {
    Object.values(layers).forEach((layer) => {
      if (layer.route && layer.name === 'handle') {
        const methods = Object.keys(layer.route?.['methods'] || {});
        const path = layer.route.path;
        this.logger.http(
          'Registered route:',
          methods.join().toUpperCase().padEnd(7),
          this.prefix + path,
        );
      }
      // // for useRouter only
      // else if (layer.handle && layer.name === 'router') {
      //   const { stack }: any = layer.handle;
      //   stack.forEach(({ route }) => {
      //     if (route) {
      //       const { path, stack } = route;
      //       this.logger.http(
      //         'Registered route:',
      //         stack.map(({ method }) => method.toUpperCase()).join(', ').padEnd(5),
      //         this.prefix + path,
      //       );
      //     }
      //   });
      // }
    });
  }
}
