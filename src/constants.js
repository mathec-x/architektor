import { colors } from "./logger.js";

export const prompts = {
  saveStructureToFile: "Do you want to save this structure to the file architecture.json?",
  continueGenerate: "Do you want to continue?",
  alreadyExist: "A structure already exists in the repository, Do you want to overwrite file architecture.json?",
  eslintInstall: "Do you want to install eslint?",
  generate: "Do you want to generate the structure folders?",
  defaultConfig: "Do you want to create the default configuration files for the project?",
  tsInstall: (list) => `Do you want to install the packages for typescript?`,
  nodeVersion: (version) =>
    `${colors.cyan}Your Current Node Version Is ${colors.yellow}${version}${colors.cyan}, Do you want to continue?${colors.reset}`,
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
    "ts-node-app",
    "dotenv-cli",
  ],
  eslintLibs: ["eslint", "globals", "@eslint/js", "typescript-eslint"],
  stages: ["test", "development", "staging", "production"],
  scripts: (appName) => ({
    dev: "dotenv -e .env.development tsx watch src/main.ts",
    start: "node dist/main.js",
    build: "tsup src/main.ts",
    test: "dotenv -e .env.test jest --coverage",
    "test:watch": "dotenv -e .env.test jest -- --watchAll --no-coverage",
    "docker:dev": "npm run docker:build:dev && npm run docker:run:dev",
    "docker:prod": "npm run docker:build:prod && npm run docker:run:prod",
    "docker:build:dev": `docker build --target development -t ${appName}:dev .`,
    "docker:build:prod": `docker build --target production -t ${appName}:prod .`,
    "docker:run:dev": `docker run -p 3000:3000 -d ${appName}:dev`,
    "docker:run:prod": `docker run -d ${appName}:prod`,
    "docker:db:up": `docker-compose -f 'docker-compose.yml' up -d --build 'postgis'`,
    "docker:db:down": `docker-compose -f 'docker-compose.yml' down`,
  }),
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
    esModuleInterop: true,
    resolveJsonModule: true,
    strictNullChecks: true,
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"],
    },
  },
};
