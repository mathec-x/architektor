# ExpressAdapter

Clean Express.js routing with dependency injection and automatic route registration.

## Quick Start

```typescript
import { ExpressAdapter } from './adapters/http/ExpressAdapter';

const app = new ExpressAdapter()
  .setPrefix('/api/v1')
  .registerFactory(() => new UserRouter(new UserUseCase()))
  .start(3001);
```

## Basic Usage

```typescript
import { Router } from 'express';

// 1. Create Router
export class UserRouter {
  readonly router = Router();

  constructor(private readonly userUseCase: UserUseCase) {
    this.router.get('/users', async (req, res, next) => {
      try {
        const result = await this.userUseCase.getAllUsers(req.query);
        res.json({ success: true, data: result });
      } catch (error) {
        next(error);
      }
    });

    this.router.post('/users', async (req, res, next) => {
      try {
        const result = await this.userUseCase.createUser(req.body);
        res.status(201).json({ success: true, data: result });
      } catch (error) {
        next(error);
      }
    });
  }
}

// 2. Create Factory
export const makeUserRouter = () => new UserRouter(new UserUseCase());

// 3. Register (method chaining)
const app = new ExpressAdapter()
  .setPrefix('/api/v1')
  .registerFactory(makeUserRouter)
  .start(3001);
```

## Multiple Routers

```typescript
// Multiple factories
export const makePokemonRouter = () => new PokemonRouter(new PokemonRepository());
export const makeTrainerRouter = () => new TrainerRouter(new TrainerUseCase());

// Register all (method chaining)
const app = new ExpressAdapter()
  .setPrefix('/api/v1')
  .registerFactory(makePokemonRouter)
  .registerFactory(makeTrainerRouter)
  .start(3001);
```
## Testing

```typescript
import { ExpressTestAdapter } from './ExpressTestAdapter';

const adapter = new ExpressTestAdapter();
const testApp = adapter.createTestModule({
  factories: [makePokemonRouter]
});

// Test your routes
await testApp.get('/api/v1/pokemon').expect(200);
await testApp.post('/api/v1/pokemon').send(data).expect(201);
```

## Middleware

```typescript
import cors from 'cors';
import helmet from 'helmet';

// Global middleware (applied to all routes)
const app = new ExpressAdapter()
  .useMiddleware(helmet())
  .useMiddleware(cors())
  .setPrefix('/api/v1')
  .registerFactory(makeRouter);

// Route-specific middleware (applied only to prefixed routes)
const app = new ExpressAdapter()
  .setPrefix('/api/v1')
  .useRouter(authMiddleware) // Only applies to /api/v1/* routes
  .registerFactory(makeRouter);
```

## Error Handling

```typescript
// Always use try-catch with next()
this.router.get('/users/:id', async (req, res, next) => {
  try {
    const result = await this.userUseCase.getUserById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
```

## Best Practices

✅ **Do:**
- Use factory functions for dependency injection
- Keep routers focused on single domain
- Always use try-catch with next()
- Use consistent response format

```typescript
// Good
export const makeUserRouter = () => new UserRouter(new UserUseCase());

res.json({ success: true, data: result });
```

❌ **Don't:**
- Hardcode dependencies
- Mix multiple domains in one router
- Skip error handling
- Use inconsistent response formats

## Complete Example

```typescript
import cors from 'cors';
import helmet from 'helmet';

// Bootstrap with method chaining
export async function bootstrapApp() {
  return new ExpressAdapter()
    .useMiddleware(helmet())
    .useMiddleware(cors())
    .setPrefix('/api/v1')
    .registerFactory(makePokemonRouter)
    .registerFactory(makeTrainerRouter)
    .start(3001);
}

// Factory
export const makePokemonRouter = () => new PokemonRouter(
  new PokemonRepository(new PokemonRepository())
);
```