import express, { RequestHandler, Router } from 'express';
import pt from 'path';
import { LoggerService } from '@/application/services/logger/LoggerService';
import { readdirSync } from 'fs';
import { ExpressRouteAdapter } from './ExpressRouteAdapter';

export class ExpressAdapter {
  private readonly logger = new LoggerService(ExpressAdapter.name);
  private readonly routeAdapter = new ExpressRouteAdapter();

  private prefix = '';
  private app = express();

  constructor() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setPrefix(prefix: string) {
    this.prefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
  }

  useRouter(...handlers: RequestHandler[]) {
    this.app.use(this.prefix, handlers);
  }

  /**
   * @example
   * 
   * export class UserRouter {
      readonly router = Router();
    
      constructor(
        private readonly userUseCase: UserUseCase
      ) {
        this.router.get('/user', async (req, res) => {
          const result = await this.userUseCase.getUser(req.query);
          res.send(result);
        });
      }
    }
   * 
   * // factory
   * const makeUserFactoryRoute = () => new UserRouter(new UserUseCase());
   * 
   * // usage
   * app.registerFactoryRouter(makeUserFactoryRoute);
   */
  registerFactoryRouter(factory: () => { router: Router }) {
    const factoryInstance = factory();
    this.printRoutes(factoryInstance.router.stack);
    this.app.use(this.prefix, this.routeAdapter.register(factoryInstance.router));
  }

  /**
   * @example
   * app.usePageRouter('adapters/pages');
   * 
   * // adapters/pages/[uuid]/index.ts
   * export const GET(req: Request, res: Response) { ... }
   * export const POST...
   */
  usePagesRouter(pagesDir: string, validMethods = ['GET', 'POST', 'PUT', 'DELETE']) {
    const path = require.main?.path || '';
    const resolvedPath = pt.join(path, pagesDir);
    const files = readdirSync(resolvedPath, {
      recursive: true,
      encoding: 'utf-8'
    }).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of files) {
      const relativePath = pt.join(resolvedPath, file);
      const routePath = `/${file
        .replace(/\\/g, '/')
        .replace(/\.(ts|js)$/, '')
        .replace(/index$/, '')
        .replace(/\[([^\]]+)\]/g, ':$1')}`;

      import(relativePath).then((module) => {
        const router = express.Router();

        if (validMethods.every(method => !module[method]))
          return this.logger.warn(`No valid HTTP methods found in module at ${file}. Skipping route registration.`);

        for (const method of validMethods)
          if (module[method] && validMethods.includes(method)) {
            router[method.toLowerCase()](routePath, module[method]);
            this.logger.http(`Registered route: ${method.padEnd(5)} ${this.prefix}${routePath}`);
          }

        this.useRouter(router);
      }).catch((error) => this.logger.critical(`Failed to load page module at ${file}:`, error));
    }
  }

  async start(port: number, callback?: () => void) {
    try {
      this.app.listen(port, (error) => {
        if (error) {
          throw error;
        }
        this.logger.info('Environment:', process.env.NODE_ENV);
        this.logger.info('Server running on port', port);
        this.logger.info('Application Name:', process.env.APPLICATION_NAME);
        this.logger.verbose('Database URL:', process.env.DATABASE_URL);
        callback?.();
      });
    } catch (error) {
      this.logger.critical(error, { port });
    }
  }

  private printRoutes(layers = this.app.router.stack) {
    setTimeout(() => Object.values(layers).forEach((layer) => {
      if (layer.route && layer.name === 'handle') {
        const methods = layer.route['methods'] || [];
        const path = layer.route.path;
        this.logger.http(
          'Registered route:',
          Object.keys(methods)[0].toUpperCase().padEnd(5),
          this.prefix + path,
        );
      } else if ('stack' in layer.handle && layer.name === 'router') {
        const { stack }: any = layer.handle;
        stack.forEach(({ route }) => {
          if (route) {
            const { path, stack } = route;
            this.logger.http(
              'Registered route:',
              stack.map(({ method }) => method.toUpperCase()).join(', ').padEnd(5),
              this.prefix + path,
            );
          }
        });
      }
    }));
  }
}
