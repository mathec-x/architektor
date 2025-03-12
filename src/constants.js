export const prompts = {
  saveStructureToFile:
    "Do you want to save this structure to the file architecture.json?",
  continueGenerate: "Do you want to continue?",
  alreadyExist:
    "A structure already exists in the repository, Do you want to overwrite file architecture.json?",
  tsInstall: (list) =>
    `Do you want to install the packages ${list} for typescript?`,
  eslintInstall: "Do you want to install eslint?",
  generate: "Do you want to generate the structure folders?",
  defaultConfig:
    "Do you want to add some configurations like prettierrc, .gitignore... ?",
};

export const settings = {
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
  stages: ["test", "development", "staging", "production"],
  scripts: {
    dev: "dotenv -e .env.development tsx watch src/main.ts",
    build: "tsup src/main.ts",
    test: "dotenv -e .env.test jest --coverage",
    "test:watch": "dotenv -e .env.test jest -- --watchAll --no-coverage",
  },
  prettier: {
    semi: true,
    singleQuote: true,
    trailingComma: "all",
    printWidth: 120,
    tabWidth: 2,
  },
  gitignore:
    "node_modules\ndist\ncoverage\n# Keep environment variables out of version control\n.env.production\n",
  editorSettings: {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit",
    },
    "explorer.fileNesting.enabled": true,
    "explorer.fileNesting.patterns": {
      Dockerfile: "Docker*, docker*, .docker*",
      ".env.development": ".env*",
      "tsconfig.json":
        "tsconfig*, jest*, eslint*, .eslint*, prettier*, .prettier*",
      "package.json":
        ".nvmrc, package*, yarn*, pnpm*, bun*, .git*, jsconfig*, config*",
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
