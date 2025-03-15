# Architect CLI

The `ts-node-app` project is a CLI for generating components in DDD, Hexagonal, Clean Architecture, and MVC architectures. Below are the available features and how to use them.

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

## Project Structures

### Clean Architecture

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
│   │   ├── controllers.ts
│   │   ├── interfaces.ts
│   │   └── routes.ts
│   ├── queue/
│   │   ├── bull.config.ts
│   │   └── process-job.ts
│   ├── repositories/
│   │   └── user-repository.ts
│   └── services/
│       ├── email.service.ts
│       └── logger.service.ts
├── shared/
│   ├── config/
│   │   ├── env.ts
│   │   └── app-config.ts
│   ├── errors/
│   │   ├── app-error.ts
│   │   └── not-found-error.ts
│   ├── middlewares/
│   │   ├── error-handler.middleware.ts
│   │   └── auth.middleware.ts
│   └── utils/
│       ├── date.util.ts
│       └── string.util.ts
└── main.ts
```

### Hexagonal Architecture

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
│       ├── create-user.use-case.ts
│       ├── update-user.use-case.ts
│       └── ports/
│           └── repositories/
│               └── user-repository.port.ts
├── infrastructure/
│   ├── http/
│   ├── database/
│   └── config/
└── main.ts
```

### MVC Architecture

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

### Serverless Architecture

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