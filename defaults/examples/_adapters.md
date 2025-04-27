### Adapters
 - Concrete implementations of the application's ports.

```ts
import { UserRepositoryPort } from '@/application/ports/user.repository.port';

export class PrismaUserRepository implements UserRepositoryPort {
    async save(user: User): Promise<void> {
        // implementation with Prisma
    }
}
```
 - Connect the system to real-world technology (DBs, APIs, services).
 - May use external libraries.
 - Should never be imported into core/ or application/.