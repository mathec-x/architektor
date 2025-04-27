### Ports (Interfaces)
 - Define contracts that adapters need to implement.

```ts
// violation.repository.port.ts
export interface ViolationRepositoryPort {
    save(violation: Violation): Promise<void>;
    findById(id: string): Promise<Violation | null>;
}
```

 - Keep the application decoupled from infrastructure details.
 - Can be adapted for databases, queues, external APIs, etc.