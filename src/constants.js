import { styled } from "./logger.js";

export const prompts = {
  saveStructureToFile: "Do you want to save this structure to the file architecture.json?",
  continueGenerate: "Do you want to continue?",
  alreadyExist: "A structure already exists in the repository, Do you want to overwrite file architecture.json?",
  eslintInstall: "Do you want to install eslint?",
  generate: "Do you want to generate the structure folders?",
  defaultConfig: "Do you want to create the default configuration files for the project?",
  tsInstall: "Do you want to install the packages for typescript?",
  nodeVersion: (version) =>
    `${styled("cyan", "Your Current Node Version Is")}${styled("yellow", version)}
     ${styled("cyan", ", Do you want to use this version?")}`,
};

export const settings = {
  initAllowedTypes: ["typescript", "ts"],
  tsLibs: [
    "@types/jest",
    "@types/supertest",
    "supertest",
    "typescript",
    "tsconfig-paths",
    "tsx",
    "tsup",
    "jest",
    "ts-jest",
    "dotenv-cli",
  ],
  eslintLibs: ["eslint", "globals", "@eslint/js", "typescript-eslint", "eslint-plugin-boundaries"],
  stages: ["test", "development", "staging", "production"],
  scripts: {
    dev: "dotenv -v LOG_LEVEL=${npm_config_log:-info} -e .env.${npm_config_env:-development} tsx watch src/main.ts",
    start: "node dist/main.js",
    build: "tsup src/main.ts",
    test: "dotenv -e .env.test jest --coverage",
    "test:watch": "dotenv -e .env.test jest -- --watchAll --no-coverage",
    "docker:dev": "npm run docker:build:dev && npm run docker:run:dev",
    "docker:run:dev": "docker run --rm -it -p 3001:3001 --name $npm_package_name -v ./:/app $npm_package_name:dev",
    "docker:build:dev": "docker build --target development -t $npm_package_name:dev -f Dockerfile .",
    "docker:prod": "npm run docker:build:prod && npm run docker:run:prod",
    "docker:run:prod": "docker run -d $npm_package_name:prod",
    "docker:build:prod": "docker build --target production -t $npm_package_name:prod -f Dockerfile .",
    "docker:db:up": "docker-compose -f 'docker-compose.yml' up -d --build 'postgis'",
    "docker:db:down": "docker-compose -f 'docker-compose.yml' down",
  },
  prettier: {
    semi: true,
    singleQuote: true,
    trailingComma: "all",
    printWidth: 120,
    tabWidth: 2,
  },
  gitignore: "node_modules\ndist\ncoverage\n# Keep environment variables out of version control\n.env.production\n",
  editorSettings: {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit",
    },
    "explorer.fileNesting.enabled": true,
    "explorer.fileNesting.patterns": {
      Dockerfile: "Docker*, docker*, .docker*",
      ".env.development": ".env*",
      "tsconfig.json": "tsconfig*, jest*, eslint*, .eslint*, prettier*, .prettier*",
      "package.json": ".nvmrc, package*, yarn*, pnpm*, bun*, .git*, jsconfig*, config*",
    },
  },
  compilerOptions: {
    target: "ES2024",
    outDir: "./dist",
    module: "nodenext",
    esModuleInterop: true,
    strictNullChecks: true,
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"],
    },
  },
};
