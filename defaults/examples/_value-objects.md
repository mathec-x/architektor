### Value Objects
 - Represent immutable values with specific meaning in the domain.

```ts
// plate.vo.ts
export class Plate {
    constructor(public readonly value: string) {
        if (!/^[A-Z]{3}\d{4}$/.test(value)) {
            throw new Error('Invalid plate format');
        }
    }
}
```
 - Do not have their own identity, only value.
 - Immutable: once created, they should not be changed.
 - Do not depend on external libraries.
