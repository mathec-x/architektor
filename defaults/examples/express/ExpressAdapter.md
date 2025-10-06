# ExpressAdapter Routing Guide

The `ExpressAdapter` class provides two powerful routing mechanisms for organizing your Express.js application: Factory Router pattern and Pages Router pattern.

## Table of Contents

- [Factory Router Pattern](#factory-router-pattern)
- [Pages Router Pattern](#pages-router-pattern)
- [Complete Bootstrap Example](#complete-bootstrap-example)
- [Best Practices](#best-practices)

## Factory Router Pattern

The Factory Router pattern allows you to register routers using factory functions, providing better dependency injection and modularity.

### Basic Usage

```typescript
import { Router } from 'express';
import { ExpressAdapter } from './adapters/http/ExpressAdapter';

// 1. Create a Router class
export class UserRouter {
  readonly router = Router();

  constructor(private readonly userUseCase: UserUseCase) {
    this.router.get('/users', async (req, res) => {
      const result = await this.userUseCase.getAllUsers(req.query);
      res.json(result);
    });

    this.router.get('/users/:id', async (req, res) => {
      const result = await this.userUseCase.getUserById(req.params.id);
      res.json(result);
    });

    this.router.post('/users', async (req, res) => {
      const result = await this.userUseCase.createUser(req.body);
      res.status(201).json(result);
    });
  }
}

// 2. Create a factory function
const makeUserFactoryRoute = () => new UserRouter(new UserUseCase());

// 3. Register the factory router
const app = new ExpressAdapter();
app.setPrefix('/api/v1');
app.registerFactoryRouter(makeUserFactoryRoute);
```

### Multiple Router Factories

```typescript
// Product Router
export class ProductRouter {
  readonly router = Router();

  constructor(private readonly productUseCase: ProductUseCase) {
    this.router.get('/products', async (req, res) => {
      const result = await this.productUseCase.getAllProducts(req.query);
      res.json(result);
    });
  }
}

// Order Router
export class OrderRouter {
  readonly router = Router();

  constructor(private readonly orderUseCase: OrderUseCase) {
    this.router.get('/orders', async (req, res) => {
      const result = await this.orderUseCase.getAllOrders(req.query);
      res.json(result);
    });
  }
}

// Factory functions
const makeProductFactoryRoute = () => new ProductRouter(new ProductUseCase());
const makeOrderFactoryRoute = () => new OrderRouter(new OrderUseCase());

// Bootstrap
export async function bootstrapApp() {
  const app = new ExpressAdapter();
  app.setPrefix('/api/v1');
  
  app.registerFactoryRouter(makeUserFactoryRoute);
  app.registerFactoryRouter(makeProductFactoryRoute);
  app.registerFactoryRouter(makeOrderFactoryRoute);
  
  return app.start(3001);
}
```

## Pages Router Pattern

The Pages Router pattern provides a file-based routing system similar to Next.js, where your folder structure determines your routes.

### Directory Structure

```
infrastructure/pages/
├── users/
│   ├── index.ts          # GET/POST /api/v1/users
│   └── [id]/
│       └── index.ts      # GET/POST /api/v1/users/:id
├── products/
│   ├── index.ts          # GET/POST /api/v1/products
│   └── [id]/
│       ├── index.ts      # GET/POST /api/v1/products/:id
│       └── reviews/
│           └── index.ts  # GET/POST /api/v1/products/:id/reviews
└── health/
    └── index.ts          # GET/POST /api/v1/health
```

### Page Module Format

Each page module should export named functions for HTTP methods:

```typescript
// infrastructure/pages/users/index.ts
import { Request, Response } from 'express';

export async function GET(req: Request, res: Response) {
  // Handle GET /api/v1/users
  const users = await getUsersUseCase.getAllUsers(req.query);
  res.json(users);
}

export async function POST(req: Request, res: Response) {
  // Handle POST /api/v1/users
  const newUser = await getUsersUseCase.createUser(req.body);
  res.status(201).json(newUser);
}
```

```typescript
// infrastructure/pages/users/[id]/index.ts
import { Request, Response } from 'express';

export async function GET(req: Request, res: Response) {
  // Handle GET /api/v1/users/:id
  const user = await getUsersUseCase.getUserById(req.params.id);
  res.json(user);
}

export async function PUT(req: Request, res: Response) {
  // Handle PUT /api/v1/users/:id
  const updatedUser = await getUsersUseCase.updateUser(req.params.id, req.body);
  res.json(updatedUser);
}

export async function DELETE(req: Request, res: Response) {
  // Handle DELETE /api/v1/users/:id
  await getUsersUseCase.deleteUser(req.params.id);
  res.status(204).send();
}
```

### Using Pages Router

```typescript
export async function bootstrapApp() {
  const app = new ExpressAdapter();
  app.setPrefix('/api/v1');
  
  // Enable pages router with custom directory
  app.usePagesRouter('./infrastructure/pages');
  
  return app.start(3001);
}
```

### Custom HTTP Methods

You can specify which HTTP methods are valid for your pages:

```typescript
// Only allow GET and POST methods
app.usePagesRouter('./infrastructure/pages', ['GET', 'POST']);
```

## Complete Bootstrap Example

```typescript
import { ExpressAdapter } from './adapters/http/ExpressAdapter';
import { makeUserFactoryRoute } from './factories/UserRouterFactory';
import { makeProductFactoryRoute } from './factories/ProductRouterFactory';

export async function bootstrapMyApp() {
  const port = Number(process.env.PORT) || 3001;
  const app = new ExpressAdapter();

  // Set API prefix
  app.setPrefix('/api/v1');

  // Option 1: Use Pages Router (file-based routing)
  app.usePagesRouter('./infrastructure/pages');

  // Option 2: Use Factory Router (class-based routing)
  // app.registerFactoryRouter(makeUserFactoryRoute);
  // app.registerFactoryRouter(makeProductFactoryRoute);

  // Option 3: Mix both approaches
  // app.usePagesRouter('./infrastructure/pages');
  // app.registerFactoryRouter(makeUserFactoryRoute);

  return app.start(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/api/v1`);
  });
}

// Start the application
bootstrapMyApp().catch(console.error);
```

## Best Practices

### Factory Router Pattern

✅ **Do:**
- Use factory functions for dependency injection
- Keep routers focused on a single domain/resource
- Use TypeScript for better type safety
- Follow consistent naming conventions

```typescript
// Good: Clear factory function with dependencies
const makeUserFactoryRoute = () => new UserRouter(
  new UserUseCase(new UserRepository())
);
```

❌ **Don't:**
- Create routers without factory functions
- Mix multiple domains in one router
- Hardcode dependencies

### Pages Router Pattern

✅ **Do:**
- Use clear, RESTful directory structure
- Export only the HTTP methods you need
- Use dynamic segments `[param]` for parameters
- Keep page modules focused and small

```typescript
// Good: Clear, focused page module
export async function GET(req: Request, res: Response) {
  const { id } = req.params;
  const user = await userService.findById(id);
  res.json(user);
}
```

❌ **Don't:**
- Export non-HTTP method functions
- Create deeply nested directory structures unnecessarily
- Put business logic directly in page modules

### General Guidelines

- Choose one pattern per project for consistency
- Use Factory Router for complex applications with heavy dependency injection
- Use Pages Router for simpler APIs or when you prefer file-based organization
- Both patterns support the same Express.js features (middleware, error handling, etc.)
- The ExpressAdapter automatically logs registered routes for debugging

### Error Handling

Both patterns support Express.js error handling:

```typescript
// Factory Router
export class UserRouter {
  readonly router = Router();

  constructor(private readonly userUseCase: UserUseCase) {
    this.router.get('/users/:id', async (req, res, next) => {
      try {
        const result = await this.userUseCase.getUserById(req.params.id);
        res.json(result);
      } catch (error) {
        next(error);
      }
    });
  }
}

// Pages Router
export async function GET(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.findById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
}
```

## Route Logging

The ExpressAdapter automatically logs all registered routes when the server starts:

```
[HTTP] Registered route: GET   /api/v1/users
[HTTP] Registered route: POST  /api/v1/users
[HTTP] Registered route: GET   /api/v1/users/:id
[HTTP] Registered route: PUT   /api/v1/users/:id
```

This helps with debugging and ensures routes are registered correctly.