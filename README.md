# Architect CLI

The `ts-node-app` project is a CLI for generating components in DDD, Hexagonal, Clean Architecture, and MVC architectures. Below are the available features and how to use them.

## Index

- [Installation](#installation)
  - [Running with NPX](#running-with-npx)
  - [Running with Alias](#running-with-alias)
    - [Global Installation](#global-installation)
    - [Development Dependency](#development-dependency)
- [Available Commands](#available-commands)
  - [`init`](#init)
  - [`pull`](#pull)
  - [`push`](#push)
  - [`generate`](#generate)
  - [`print`](#print)
- [Usage Examples](#usage-examples)
  - [Set Up TypeScript Project](#set-up-typescript-project)
  - [Generate Structure File](#generate-structure-file)
  - [Apply Hexagonal Structure](#apply-hexagonal-structure)
  - [Generate Structure from File](#generate-structure-from-file)
  - [Print Current Structure](#print-current-structure)
- [Architecture Concepts](#architecture-concepts)
  - [Clean Architecture](#clean-architecture)
  - [Domain-Driven Design (DDD)](#domain-driven-design-ddd)
  - [Hexagonal Architecture](#hexagonal-architecture)
  - [MVC Architecture](#mvc-architecture)
  - [Serverless Architecture](#serverless-architecture)
- [Complete Project Setup](#complete-project-setup)
  - [Scripts](#scripts)
  - [Development Dependencies](#development-dependencies)
- [Conclusion](#conclusion)

## Installation

You can install the CLI globally or as a development dependency in your project.

### Running with NPX

You can run the CLI directly with `npx` without the need for installation.

```sh
npx ts-node-app <command>
```

### Running with Alias

If you install the package globally or as a development dependency, you can use the alias `tsna` to run the commands.

#### Global Installation

```sh
npm install -g ts-node-app
```

#### Development Dependency

```sh
npm install --save-dev ts-node-app
```

Once installed, you can use the alias:

```sh
tsna <command>
```

## Available Commands

### `init`

Sets up all necessary dependencies for a backend project in TypeScript.

```sh
npx ts-node-app init <type>
```

- `type`: Project type (default: `typescript`).
- `-v, --verbose`: Prints more information during execution.

### `pull`

Generates an `architecture.json` file from the current project structure.

```sh
npx ts-node-app pull <path>
```

- `path`: Path to the project's root directory (e.g., `./src` or `./`).
- `-v, --verbose`: Prints more information during execution.
- `-i, --ignore <any>`: Ignores specific files or directories (e.g., `node_modules,coverage,dist`).

### `push`

Applies a project structure based on one of the supported patterns.

```sh
npx ts-node-app push <type>
```

- `type`: Architecture type (hexagonal, clean, mvc, serverless).
- `-v, --verbose`: Prints more information during execution.

### `generate`

Applies the structure defined in the `architecture.json` file to the project.

```sh
npx ts-node-app generate
```

- `-v, --verbose`: Prints more information during execution.

### `print`

Prints the current structure defined in the `architecture.json` file.

```sh
npx ts-node-app print
```

- `-v, --verbose`: Prints more information during execution.

## Usage Examples

### Set Up TypeScript Project

```sh
npx ts-node-app init typescript
```

### Generate Structure File

```sh
npx ts-node-app pull ./src
```

### Apply Hexagonal Structure

```sh
npx ts-node-app push hexagonal
```

### Generate Structure from File

```sh
npx ts-node-app generate
```

### Print Current Structure

```sh
npx ts-node-app print
```

## Architecture Concepts

### Clean Architecture

Clean Architecture is a software design philosophy that emphasizes the separation of concerns, making the codebase more maintainable, testable, and scalable.
It aims to create a clear distinction between the business logic and the infrastructure of an application.

In Clean Architecture, the core business logic is isolated from external dependencies such as databases, frameworks, and user interfaces.
This is achieved by organizing the code into layers, each with a specific responsibility.

The main layers are:

1. **Entities**: Represent the core business objects and rules.
2. **Use Cases**: Contain the application-specific business rules and orchestrate the flow of data between entities and external systems.
3. **Interface Adapters**: Convert data from the format most convenient for the use cases and entities to the format most convenient for external systems.
4. **Frameworks and Drivers**: Include external systems such as databases, web frameworks, and user interfaces.

### Domain-Driven Design (DDD)

Domain-Driven Design (DDD) is a software development approach that focuses on modeling the domain of the application based on the real-world business context. 
It emphasizes collaboration between technical and domain experts to create a shared understanding of the domain and its complexities.

DDD introduces several key concepts:

1. **Entities**: Objects that have a distinct identity and lifecycle.
2. **Value Objects**: Immutable objects that describe aspects of the domain with no distinct identity.
3. **Aggregates**: Clusters of entities and value objects that are treated as a single unit for data changes.
4. **Repositories**: Abstractions that provide access to aggregates.
5. **Services**: Operations that do not naturally fit within entities or value objects.
6. **Domain Events**: Events that signify something important has happened within the domain.

### Example Structure

```plaintext
src/
├── application/
│   ├── use-cases/                       # Application use cases
│   │   ├── create-user.use-case.ts
│   │   ├── update-user.use-case.ts
│   │   └── delete-user.use-case.ts
│   └── dto/                             # Data Transfer Objects
│       └── user-dto.ts
├── domain/                              # Domain Layer (Business Rules)
│   ├── entities/                        # Domain Entities
│   │   └── user.ts
│   ├── value-objects/                   # Value Objects (e.g., Email, CPF)
│   │   └── email.ts
│   ├── aggregates/                      # Domain Aggregates
│   │   └── user.aggregate.ts
│   ├── repositories/                    # Domain Repository Interfaces
│   │   └── user-repository.ts
│   ├── services/                        # Domain Services (rules involving multiple entities)
│   │   └── user-service.ts
│   ├── events/                          # Domain Events
│   │   └── user-created.event.ts
│   └── exceptions/                      # Domain-related Exceptions
│       └── UserNotFoundException.ts
├── infrastructure/                      # Technical Implementations (Database, External APIs)
│   ├── config/
│   │   └── app-config.ts
│   ├── repositories                     # Concrete Repository Implementations
│   │   └── UserRepository.ts
│   ├── logger                           # Logger Implementation
│   │   └── logger.ts
│   ├── http                             # Presentation Layer Implementation (API, Web)
│   │   └── server.ts
│   ├── services                         # Technical Service Implementations
│   │   ├── auth.service.ts
│   │   └── email.service.ts
│   ├── database/                        # Database Configuration
│   │   └── prisma/
│   │       ├── client.ts
│   │       └── user-repository.ts
├── shared/
│   ├── utils/
│   │   ├── date.util.ts
│   │   └── string.util.ts
│   ├── constants/
│   │   └── error-codes.ts
│   ├── mappers/
│   │   └── user.mapper.ts
│   ├── errors/
│   │   ├── app-error.ts
│   │   └── not-found-error.ts
│   └── middlewares/
│       ├── error-handler.middleware.ts
│       └── auth.middleware.ts
└── main.ts
```

#### Summary of Differences

| Feature        | DDD                                          | Clean Architecture                                  |
| -------------- | -------------------------------------------- | --------------------------------------------------- |
| Main Focus     | Domain modeling and business rules           | Separation of concerns and minimal coupling         |
| Organization   | Based on entities, aggregates, services      | Based on independent layers                         |
| Use Cases      | Apply specific business rules                | Are the central layer of the system                 |
| Repositories   | Part of the domain (interface and implementation) | Are adapters (not part of the core)                 |
| Infrastructure | Concrete implementations within the domain   | Infrastructure is separated                         |
| Dependencies   | May have coupling to ORM                     | Does not depend on external frameworks              |

### Clean Architecture with Domain-Driven Design (DDD)

Combining Clean Architecture with Domain-Driven Design (DDD) provides a robust framework for building scalable and maintainable applications by clearly defining the boundaries between different parts of the system and focusing on the core business logic.

```plaintext
src/
├── application/
│   ├── dto/
│   │   ├── user-dto.ts
│   │   └── product-dto.ts
│   ├── services/
│   │   ├── notification.service.ts
│   │   └── cache.service.ts
│   └── use-cases/
│       └── user/
│           ├── create-user.use-case.ts
│           ├── update-user.use-case.ts
│           └── delete-user.use-case.ts
├── domain/
│   ├── entities/
│   │   ├── user.ts
│   │   └── product.ts
│   ├── interfaces/
│   │   ├── user-repository.ts
│   │   └── email-service.ts
│   ├── services/
│   │   ├── auth-service.ts
│   │   └── payment-service.ts
│   └── value-objects/
│       ├── email.ts
│       └── price.ts
├── infrastructure/
│   ├── cache/
│   │   └── redis.ts
│   ├── database/
│   │   └── prisma/
│   │       ├── client.ts
│   │       ├── migrations/
│   │       └── user.repository.ts
│   ├── http/
│   │   ├── controllers/
│   │   │   ├── user.controller.ts
│   │   │   └── product.controller.ts
│   │   ├── routes/
│   │   │   ├── user.routes.ts
│   │   │   └── product.routes.ts
│   │   └── interfaces/
│   │       └── http-server.ts
│   ├── queue/
│   │   ├── bull.config.ts
│   │   └── process-job.ts
│   ├── repositories/
│   │   └── user-repository.ts
│   ├── config/
│   │   └── app-config.ts
│   └── services/
│       ├── email.service.ts
│       └── logger.service.ts
├── shared/
│   ├── config/
│   │   └── env.ts
│   ├── errors/
│   │   ├── app-error.ts
│   │   └── not-found-error.ts
│   ├── mappers/
│   │   ├── user.mapper.ts
│   │   └── product.mapper.ts
│   ├── constants/
│   │   └── error-codes.ts
│   ├── middlewares/
│   │   ├── error-handler.middleware.ts
│   │   └── auth.middleware.ts
│   └── utils/
│       ├── date.util.ts
│       └── string.util.ts
└── main.ts
```

This structure ensures that the core business logic is isolated from external dependencies, making the codebase more maintainable, testable, and scalable. The use cases orchestrate the flow of data between the domain and external systems, while the infrastructure layer handles the implementation details of these systems.

### Hexagonal Architecture

Hexagonal Architecture, also known as Ports and Adapters, is a design pattern that aims to create loosely coupled application components that can be easily connected to their software environment through ports and adapters. This architecture promotes separation of concerns, making the application more modular, testable, and maintainable.

In a Hexagonal Architecture, the core logic of the application is isolated from external systems such as databases, user interfaces, and third-party services. The core interacts with these external systems through well-defined interfaces (ports), and the actual implementation of these interfaces (adapters) can be swapped without affecting the core logic.

Examples of Adapters:
```ts
// Input Adapter (Controller)
import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../core/use-cases/create-user.use-case';

export class UserController {
    constructor(private createUserUseCase: CreateUserUseCase) {}

    async createUser(req: Request, res: Response): Promise<Response> {
        const { name, email } = req.body;
        try {
            const user = await this.createUserUseCase.execute({ name, email });
            return res.status(201).json(user);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

// Output Adapter (Repository)
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../core/ports/repositories/user-repository.port';
import { User } from '../../core/domain/entities/user';

export class PrismaUserRepository implements UserRepository {
    private prisma = new PrismaClient();

    async save(user: User): Promise<User> {
        const savedUser = await this.prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
        return new User(savedUser.id, savedUser.name, savedUser.email);
    }

    // Other repository methods...
}
```

#### Example Structure

```plaintext
src/
├── adapters/
│   ├── persistence/
│   │   └── prisma-user.repository.ts
│   ├── controllers/
│   │   └── user.controller.ts
│   └── gateways/
│       └── email.gateway.ts
├── core/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── user.ts
│   │   ├── value-objects/
│   │   │   └── email.ts
│   │   ├── aggregates/
│   │   │   └── user.aggregate.ts
│   │   ├── repositories/
│   │   │   └── user-repository.ts
│   │   └── domain-events/
│   │       ├── domain-event.ts
│   │       ├── user-created.event.ts
│   │       └── user-email-changed.event.ts
│   └── use-cases/
│   │   ├── create-user.use-case.ts
│   │   ├── update-user.use-case.ts
│   └── ports/
│       └── repositories/
│       └── user-repository.port.ts
├── infrastructure/
│   ├── http/
│   ├── database/
│   └── config/
└── main.ts
```

This structure ensures that the core business logic is independent of external systems, making it easier to test and maintain. The adapters are responsible for connecting the core to the external systems, allowing for flexibility and scalability in the application.

### MVC Architecture

MVC (Model-View-Controller) is a software architectural pattern that separates an application into three main logical components: the Model, the View, and the Controller. Each of these components is built to handle specific development aspects of an application.

1. **Model**: Represents the data and the business logic of the application. It directly manages the data, logic, and rules of the application. The model responds to requests for information and updates from the view and instructions from the controller to update itself.

2. **View**: Represents the UI (User Interface) of the application. It displays the data from the model to the user and sends user commands to the controller. The view is responsible for rendering the model's data in a format suitable for interaction.

3. **Controller**: Acts as an intermediary between the model and the view. It listens to the input from the view, processes it (possibly altering the model's state), and returns the output display to the view. The controller handles the user input and updates the model and view accordingly.

#### Example Structure

```plaintext
src/
├── config/
│   ├── database.config.ts
│   └── app.config.ts
├── controllers/
│   ├── user.controller.ts
│   └── product.controller.ts
├── middlewares/
│   ├── auth.middleware.ts
│   └── error-handler.middleware.ts
├── models/
│   ├── user.model.ts
│   └── product.model.ts
├── views/
│   ├── user.view.ts
│   └── product.view.ts
├── routes/
│   ├── user.routes.ts
│   └── product.routes.ts
├── services/
│   ├── user.service.ts
│   └── product.service.ts
├── utils/
│   ├── date.util.ts
│   └── string.util.ts
└── main.ts
```

This structure ensures a clear separation of concerns, making the application easier to manage, test, and scale. The model handles the data and business logic, the view manages the presentation layer, and the controller processes user input and updates the model and view accordingly.

### Serverless Architecture

Serverless Architecture is a cloud computing execution model where the cloud provider dynamically manages the allocation and provisioning of servers. In this architecture, developers can build and run applications without having to manage the underlying infrastructure. The term "serverless" is a bit of a misnomer, as servers are still involved, but the management of these servers is abstracted away from the developer.

In a serverless architecture, applications are typically composed of small, stateless functions that are triggered by events. These functions are often referred to as "Functions as a Service" (FaaS). The cloud provider automatically scales the functions in response to the number of incoming requests, ensuring that the application can handle varying levels of traffic without manual intervention.

#### Example Structure

```plaintext
src/
├── config/
│   ├── databaseConfig.ts
│   └── appConfig.ts
├── functions/
│   ├── createUser/
│   │   ├── handler.ts
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── updateUser/
│   │   ├── handler.ts
│   │   ├── index.ts
│   │   └── schema.ts
│   └── deleteUser/
│       ├── handler.ts
│       ├── index.ts
│       └── schema.ts
├── models/
│   └── userModel.ts
├── services/
│   └── userService.ts
├── utils/
│   ├── dateUtil.ts
│   └── stringUtil.ts
└── serverless.yml
```

This structure ensures that the application is modular and each function is responsible for a specific task. The `serverless.yml` file is used to define the configuration for the serverless framework, specifying the functions, events that trigger them, and the resources they require.

Serverless architecture offers several benefits, including reduced operational complexity, automatic scaling, and a pay-as-you-go pricing model. It is particularly well-suited for applications with unpredictable or fluctuating workloads, as it can efficiently handle varying levels of demand without the need for manual scaling.

## Complete Project Setup

When running the `init` command, the project will be set up with the following scripts and dependencies:

### Scripts

- `dev`: `dotenv -e .env.development tsx watch src/main.ts`
- `start`: `node dist/main.js`
- `build`: `tsup src/main.ts`
- `test`: `echo "Error: no test specified" && exit 1`
- `test:watch`: `dotenv -e .env.test jest -- --watchAll --no-coverage`
- `docker:dev`: `npm run docker:build:dev && npm run docker:run:dev`
- `docker:prod`: `npm run docker:build:prod && npm run docker:run:prod`
- `docker:build:dev`: `docker build --target development -t application-name:dev .`
- `docker:build:prod`: `docker build --target production -t application-name:prod .`
- `docker:run:dev`: `docker run -p 3000:3000 -d application-name:dev`
- `docker:run:prod`: `docker run -d application-name:prod`
- `docker:db:up`: `docker-compose -f 'docker-compose.yml' up -d --build 'postgis'`
- `docker:db:down`: `docker-compose -f 'docker-compose.yml' down`

### Development Dependencies

- `@eslint/js`: `^9.22.0`
- `@types/jest`: `^29.5.14`
- `@types/supertest`: `^6.0.2`
- `dotenv-cli`: `^8.0.0`
- `eslint`: `^9.22.0`
- `globals`: `^16.0.0`
- `jest`: `^29.7.0`
- `supertest`: `^7.0.0`
- `ts-jest`: `^29.2.6`
- `ts-node-app`: `^0.1.0`
- `tsconfig-paths`: `^4.2.0`
- `tsup`: `^8.4.0`
- `tsx`: `^4.19.3`
- `typescript`: `^5.8.2`
- `typescript-eslint`: `^8.26.1`

## Conclusion

The `ts-node-app` CLI facilitates the creation and maintenance of project structures following well-defined architectural patterns. Use the commands above to efficiently manage your project's structure.
