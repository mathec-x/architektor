# Architect CLI

The `ts-node-app` project is a CLI for generating components in DDD, Hexagonal, Clean Architecture, and MVC architectures. Below are the available features and how to use them.

## Getting Started

Before using any other commands, the first step is to initialize your TypeScript project.
This sets up all necessary dependencies and configurations.

```sh
npx ts-node-app init typescript
```

> This command will prepare your project with the required setup for a TypeScript backend application.
> The structure of the setup will be saved in an `architecture.json` file.
> You can modify this file before running the `generate` command to adjust the structure to better suit your needs.

```bash
Usage: ts-node-app [options] [command]

Options:
  -h, --help             display help for command

Commands:
  pull [options] <path>  Generate 'architecture.json' file by path argument and save it in the root of the project
                         you can ignore some files or directories by comma separated and regex patterns ex: package?,node_modules
  push [options] [type]  Push structure to the project
  generate [options]     Apply structure from file architecture.json
  print [options]        Print current structure file architecture.json
  init [options] [type]  Setup all dependencies for backend TypeScript project
  help [command]         display help for command
```

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
- [Complete Project Setup](#complete-project-setup)
  - [Scripts](#scripts)
  - [Development Dependencies](#development-dependencies)
- [Architecture Concepts](#architecture-concepts)
  - [Clean Architecture](#clean-architecture)
  - [Domain-Driven Design (DDD)](#domain-driven-design-ddd)
  - [Some Concepts about Layers and Components](#some-concepts-about-layers-and-components)
    - [Entity](#entity)
    - [Value Object](#value-object)
    - [Aggregate](#aggregate)
    - [Domain Exceptions (exceptions/)](#domain-exceptions-exceptions)
    - [Interfaces](#interfaces)
    - [Presentation](#presentation)
      - [Example Simple Structure DDD](#example-simple-structure-ddd)
      - [Clean Architecture with Domain-Driven Design (DDD)](#clean-architecture-with-domain-driven-design-ddd)
  - [Hexagonal Architecture](#hexagonal-architecture)
    - [Example Structure](#example-structure)
  - [MVC Architecture](#mvc-architecture)
    - [Example Structure](#example-structure-1)
  - [Serverless Architecture](#serverless-architecture)
    - [Example Structure](#example-structure-2)
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

## Some Concepts about Layers and Components

### Entity

> Domain-Driven Design (DDD) → Used to represent domain objects.

> Clean Architecture → Belongs to the domain layer (Core).

1. Object with a unique identity.
2. Mutable state over time.
3. Compared by its identifier (id) and not by attribute values.

### Value Object

> Domain-Driven Design (DDD) → Used to maintain consistency between entities.

> Principle of Immutability → Value objects should not be altered.

1. Immutable object.
2. Compared by its content, not by an id.
3. Encapsulates specific logic within it.

```typescript
export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email.");
    }
    this.value = email.toLowerCase();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getValue(): string {
    return this.value;
  }
}
```

### Aggregate

> Domain-Driven Design (DDD) → Used to maintain consistency between entities.

> Encapsulation → Only the aggregate root can modify its internal entities.

1. Group of related entities treated as a single unit.
2. Has an "aggregate root" that controls the other entities.
3. Ensures internal consistency by allowing changes only through the root.

```typescript
import { User } from "../entities/User";

export class Account {
  constructor(private owner: User, private balance: number = 0) {}

  deposit(amount: number) {
    if (amount <= 0) throw new Error("Deposit must be greater than zero.");
    this.balance += amount;
  }

  withdraw(amount: number) {
    if (amount > this.balance) throw new Error("Insufficient balance.");
    this.balance -= amount;
  }

  getBalance() {
    return this.balance;
  }
}
```

### Domain Exceptions (exceptions/)

1. Specific domain errors should have their own classes.

```typescript
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainException";
  }
}

export class InsufficientBalanceException extends DomainException {
  constructor() {
    super("Insufficient balance.");
  }
}
```

### Interfaces

```typescript
export interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}
```

- Domain-Driven Design (domain/contracts)
  - They are in the domain layer because the domain cannot depend on external technologies.
  - Interfaces are used to define repositories, domain services, and factories.
- Clean Architecture (application/interfaces)
  - In Clean Architecture, this layer is usually called "Interfaces" or "Contracts".
  - It defines Gateways, Repositories, and Services, which will be used by Use Cases.
- Hexagonal Architecture (core/ports)
  - In Hexagonal Architecture, this layer is called "Ports".
  - Ports define how the domain communicates with the external world, but without implementing anything.

### Presentation

The Presentation layer is responsible for the application's input interface, meaning it receives user requests and translates them into use cases (Use Cases or Application Services).

📌 It appears in architectures like Clean Architecture and Hexagonal, it is not a central concept of DDD!
📌 It does NOT contain business rules! Its only role is to interpret inputs and direct them to the use cases.
It can contain different types of input adapters, depending on the type of interface:

| Input Type  | Example                                 |
| ----------- | --------------------------------------- |
| REST API    | Controllers (Express, Fastify, NestJS)  |
| GraphQL API | Resolvers (Apollo, Mercurius)           |
| CLI         | Terminal commands (Commander.js, Yargs) |
| WebSockets  | Real-time connection management         |
| Messaging   | Message queues (Kafka, RabbitMQ)        |

### Key Differences

**DDD**: Defines how to model the domain with well-structured business rules.

**Clean Architecture**: Defines the separation into layers to maintain low coupling.

**Hexagonal Architecture**: Defines how the domain communicates with the external world through ports & adapters.

### Example Simple Structure DDD

```plaintext
src/
├── application/
│   ├── use-cases/
│   │   ├── create-user.use-case.ts
│   │   ├── update-user.use-case.ts
│   │   └── delete-user.use-case.ts
│   └── dto/
│       └── user-dto.ts
├── domain/
│   ├── entities/
│   │   └── user.ts
│   ├── value-objects/
│   │   └── email.ts
│   ├── aggregates/
│   │   └── user.aggregate.ts
│   ├── contracts/
│   │   └── user.contract.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── events/
│   │   └── user.created.event.ts
│   └── exceptions/
│       └── UserNotFoundException.ts
├── infrastructure/
│   ├── config/
│   │   └── app-config.ts
│   ├── repositories
│   │   └── UserRepository.ts
│   ├── logger
│   │   └── logger.ts
│   ├── http
│   │   └── server.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   └── email.service.ts
│   ├── database/
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
├── presentaion/
│   ├── controllers/
│   │   ├── user.controller.ts
│   │   └── product.controller.ts
│   ├── routes/
│   │   ├── user.routes.ts
│   │   └── product.routes.ts
│   ├── middlewares/
│   │   ├── error-handler.middleware.ts
│   │   └── auth.middleware.ts
│   ├── graphql/
│   │   ├── resolvers/
│   │   │   ├── user.resolver.ts
│   │   │   └── product.resolver.ts
│   │   └── schema.ts
│   ├── websockets/
│   │   ├── socket-server.ts
│   │   └── socket-events.ts
│   └── cli/
│       └── user-cli.ts
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

Hexagonal Architecture, also known as Ports and Adapters, is a design pattern that aims to create loosely coupled application components that can easily interact with external systems through ports and adapters.
This promotes separation of concerns, making the application more modular, testable, and maintainable.

In Hexagonal Architecture, the core logic of the application is completely isolated from external systems such as databases, user interfaces, and third-party services.
The core interacts with these systems only through well-defined interfaces (ports), while the actual implementations (adapters) can be swapped without affecting the business logic.

| **Adapter Type**      | **Function**                              | **Implementation Example**          |
|------------------------|-------------------------------------------|--------------------------------------|
| **Persistence**        | Save and retrieve data                   | Prisma, Sequelize, MongoDB, Redis   |
| **Controllers**        | Adapt HTTP input for use cases           | Express, Fastify, NestJS, HapiJS    |
| **Gateways**           | Communication with external services     | Stripe, SendGrid, Twilio, Firebase  |
| **Messaging**          | Asynchronous communication (queues)      | Kafka, RabbitMQ, AWS SQS            |
| **CLI Adapters**       | Command line input                       | Commander.js, yargs                 |
| **GraphQL Resolvers**  | Adapt GraphQL input and output           | Apollo Server, Mercurius            |
| **WebSockets**         | Real-time bidirectional communication    | Socket.io, WebRTC                   |

- When to Use Each Adapter
- **Persistence**: Used for storing or retrieving data from databases or caches (e.g., PostgreSQL, MongoDB, Redis).
- **Controllers**: Handle HTTP requests and expose REST endpoints for client communication.
- **Gateways**: Facilitate interaction with external APIs (e.g., payments, emails, notifications).
- **Messaging**: Enable asynchronous communication through message queues (e.g., Kafka, RabbitMQ).
- **CLI**: Provide command-line interfaces for interacting with the system.
- **GraphQL**: Expose GraphQL endpoints for API communication instead of REST.
- **WebSockets**: Support real-time communication for use cases like chat applications or live notifications.

> 🔥 **Final Summary**
> 📌 Adapters are the concrete implementations that connect the domain to the outside world.
> 📌 The core domain should never depend directly on these external implementations.
> 📌 Each adapter type serves a specific responsibility, ensuring flexibility and reducing coupling.

#### Example Structure

```bash
src/
├── adapters/
│   ├── persistence/              # Repository implementations (Prisma, Sequelize, etc.)
│   ├── modules/                  # Module implementations (NestJS modules, etc.)
│   ├── controllers/              # HTTP controllers (Express adapters, route handlers)
│   └── gateways/                 
│       ├── RabbitMQGateway.ts    # Message queue gateways (RabbitMQ, Kafka, etc.)
│       ├── AWSGateway.ts         # AWS services integration (S3, SNS, etc.)
│       └── KafkaGateway.ts       # External API gateways (Kafka, SendGrid, etc.)
├── application/
│   ├── ports/                    # Interfaces for the application layer
│   ├── services/                 # Application services (UserService, etc.)
│   ├── dtos/                     # Data Transfer Objects (UserDTO, etc.)
│   ├── mappers/                  # DTO mappers (UserMapper, etc.)
│   ├── validators/               # DTO validation classes (UserValidator, etc.)
│   └── use-cases/                # Use cases (CreateUser, UpdateUser, etc.)
├── core/
│   ├── entities/                 # Core domain entities (User, Vehicle, etc.)
│   ├── services/                 # Domain services (encapsulate specific business logic)
│   ├── value-objects/            # Immutable domain values (CPF, PlateNumber, etc.)
│   ├── aggregates/               # Aggregate roots that manage entity lifecycles
│   ├── exceptions/               # Domain-specific exceptions
│   └── domain-events/            # Domain event definitions
│       ├── domain-event.ts
│       ├── user-created.event.ts
│       └── user-email-changed.event.ts
├── infrastructure/
│   ├── http/                     # HTTP server and middleware setup (Express, Fastify, etc.)
│   ├── database/                 # Database configurations (Prisma client, etc.)
│   ├── config/                   # Environment and general configurations (logger, env, etc.)
│   └── bootstrap/                # Application bootstrap logic (server.ts, NestJS bootstrapping)
└── main.ts                        # Application entry point
tests/
└── main-e2e.spec.ts               # Main end-to-end tests
```

This structure ensures that the core business logic remains independent from external systems, making it easier to test, maintain, and evolve over time.
 - The `core` layer holds the domain model and domain services.
 - The `application` layer orchestrates the use cases.
 - The `adapters` provide the necessary bridges to the external world.

#### Summary of Differences

✅ DDD → Defines how to model the domain with well-structured business rules.
✅ Clean Architecture → Defines the separation into layers to maintain low coupling.
✅ Hexagonal Architecture → Defines how the domain communicates with the external world through ports & adapters.

| Feature        | DDD                                               | Clean Architecture                          | Hexagonal Architecture                                       |
| -------------- | ------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| Main Focus     | Domain modeling and business rules                | Separation of concerns and minimal coupling | Isolation of domain from external dependencies               |
| Organization   | Based on entities, aggregates, services           | Based on independent layers                 | Based on Ports & Adapters pattern                            |
| Use Cases      | Apply specific business rules                     | Are the central layer of the system         | Encapsulated in the domain layer                             |
| Repositories   | Part of the domain (interface and implementation) | Are adapters (not part of the core)         | Defined as ports (interfaces), implemented by adapters       |
| Infrastructure | Concrete implementations within the domain        | Infrastructure is separated                 | Implementations reside in Adapters layer                     |
| Dependencies   | May have coupling to ORM                          | Does not depend on external frameworks      | Domain is framework-agnostic, interfaces bridge dependencies |

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

## Conclusion

The `ts-node-app` CLI facilitates the creation and maintenance of project structures following well-defined architectural patterns. Use the commands above to efficiently manage your project's structure.
