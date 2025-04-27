### Domain Services
 - Small classes that encapsulate specific rules, such as:

```ts
// vehicle-validator.service.ts
export class VehicleValidator {
    validate(vehicle: VehicleInput): void {
        if (!vehicle.plate) throw new DomainException('Plate is required');
        // other rules...
    }
}
```

 - Are injected into repositories or application services.
 - Can be used in unit tests to simulate specific behaviors.
 - Should be small and focused on a single responsibility.
 - Should not have external dependencies, except for other domain classes.
 - Must be tested with unit tests.