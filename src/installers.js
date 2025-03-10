import { Logger } from "./logger.js";
import { spawnSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

export class Installers {
  constructor() {
    this.logger = new Logger(Installers.name);
    this.libs = {
      ts: ["@types/node", "typescript", "tsconfig-paths", "tsx", "tsup"],
    };
  }

  /** @private */
  #readJsonFile(path) {
    try {
      return JSON.parse(
        readFileSync(path, "utf8").replace(
          /\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm,
          ""
        )
      );
    } catch {
      return {};
    }
  }

  /** @private */
  #writeJsonFile(path, data) {
    return writeFileSync(path, JSON.stringify(data, null, 2));
  }

  async prettier() {
    this.logger.info("Creating .prettierrc...");
    this.#writeJsonFile(".prettierrc", {
      semi: true,
      singleQuote: true,
      trailingComma: "all",
      printWidth: 120,
      tabWidth: 2,
    });

    this.logger.info("Prettier installed successfully!");
  }

  async eslint() {
    this.logger.info("Creating eslint.config.mjs...");
    spawnSync("npm", ["init", "@eslint/config@latest"], {
      stdio: "inherit",
    });

    if (!existsSync(".vscode")) {
      this.logger.info("Creating dir '.vscode'...");
      mkdirSync(".vscode");
    }

    const currentSettings = this.#readJsonFile("./.vscode/settings.json");
    this.logger.debug("Current settings.json:", currentSettings);
    this.#writeJsonFile(".vscode/settings.json", {
      ...currentSettings,
      "editor.formatOnSave": true,
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit",
      },
      "explorer.fileNesting.enabled": true,
      "explorer.fileNesting.patterns": {
        "package.json":
          "package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb, .nvmrc, prettier.config.js, .eslintrc.js, .eslintignore, .prettierrc, .prettierrc.js, .prettierrc.json, .prettierrc.yaml, .prettierrc.yml, .prettierrc.toml, .prettierrc.cjs, .prettierrc.config.js., .env*, .git*, eslint*, *config.js, *config.json, *config.yaml, *config.yml, *config.toml, *config.cjs, *config.config.js, architecture.json",
      },
    });
  }

  async typescript() {
    this.logger.info(`Installing ${this.libs.ts}...`);
    const tsConfig = {
      esModuleInterop: true,
      resolveJsonModule: true,
      strictNullChecks: true,
      baseUrl: ".",
      paths: {
        "@/*": ["./src/*"],
      },
    };

    spawnSync("npm", ["install", "--save-dev", ...this.libs.ts], {
      stdio: "inherit",
    });

    if (!existsSync("tsconfig.json")) {
      this.logger.info("Creating tsconfig.json...");
      spawnSync("npx", ["tsc", "--init"], {
        stdio: "inherit",
      });
    }

    const currentTsConfig = this.#readJsonFile("tsconfig.json");

    console.log("\n\rAdding tsconfig.json paths...\n");
    for (const [key, value] of Object.entries(tsConfig)) {
      console.log(`${key}:`, value);
    }
    console.log("\n");

    this.#writeJsonFile("tsconfig.json", {
      compilerOptions: {
        ...currentTsConfig.compilerOptions,
        ...tsConfig,
      },
    });

    this.logger.info("TypeScript installed successfully!");
  }
}
