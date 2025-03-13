# Architect CLI

O projeto `ts-node-app` é uma CLI para geração de componentes em arquiteturas DDD, Hexagonal, Clean Architecture e MVC. Abaixo estão as funcionalidades disponíveis e como utilizá-las.

## Instalação

Você pode instalar a CLI globalmente ou como uma dependência de desenvolvimento no seu projeto.
### Execução com NPX

Você pode executar a CLI diretamente com `npx` sem a necessidade de instalação.

```sh
npx ts-node-app <comando>
```

### Execução com Alias

Se você instalar o pacote, pode utilizar o alias `tsna` para executar os comandos.

```sh
tsna <comando>
```

## Comandos Disponíveis

### `init`

Configura todas as dependências necessárias para um projeto backend em TypeScript.

```sh
npx ts-node-app init <type>
```

- `type`: Tipo de projeto (padrão: `typescript`).
- `-v, --verbose`: Imprime mais informações durante a execução.

### `pull`

Gera um arquivo `architecture.json` a partir da estrutura atual do projeto.

```sh
npx ts-node-app pull <path>
```

- `path`: Caminho para o diretório raiz do projeto (ex: `./src` ou `./`).
- `-v, --verbose`: Imprime mais informações durante a execução.
- `-i, --ignore <any>`: Ignora arquivos ou diretórios específicos (ex: `node_modules,coverage,dist`).

### `push`

Aplica uma estrutura de projeto baseada em um dos padrões suportados.

```sh
npx ts-node-app push <type>
```

- `type`: Tipo de arquitetura (hexagonal, clean, mvc, serverless).
- `-v, --verbose`: Imprime mais informações durante a execução.

### `generate`

Aplica a estrutura definida no arquivo `architecture.json` ao projeto.

```sh
npx ts-node-app generate
```

- `-v, --verbose`: Imprime mais informações durante a execução.

### `print`

Imprime a estrutura atual definida no arquivo `architecture.json`.

```sh
npx ts-node-app print
```

- `-v, --verbose`: Imprime mais informações durante a execução.

## Exemplos de Uso

### Configurar Projeto TypeScript

```sh
npx ts-node-app init typescript
```

### Gerar Arquivo de Estrutura

```sh
npx ts-node-app pull ./src
```

### Aplicar Estrutura Hexagonal

```sh
npx ts-node-app push hexagonal
```

### Gerar Estrutura a partir do Arquivo

```sh
npx ts-node-app generate
```

### Imprimir Estrutura Atual

```sh
npx ts-node-app print
```

## Estruturas de Projeto

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

## Conclusão

A CLI `ts-node-app` facilita a criação e manutenção de estruturas de projeto seguindo padrões arquiteturais bem definidos. Utilize os comandos acima para gerenciar a estrutura do seu projeto de forma eficiente.