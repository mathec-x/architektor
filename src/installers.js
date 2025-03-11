import { settings } from "./constants.js";
import { Logger } from "./logger.js";
import { spawnSync } from "child_process";

export class Installers {
  /**
   * @param {FileManager} fileManager
   */
  constructor(fileManager) {
    this.fileManager = fileManager;
    this.logger = new Logger(Installers.name);
    this.libs = {
      ts: ["@types/node", "typescript", "tsconfig-paths", "tsx", "tsup"],
    };
  }

  async prettier() {
    if (!this.fileManager.isFile(".prettierrc")) {
      this.logger.info("Creating .prettierrc...");
      this.fileManager.writeJsonFile(".prettierrc", settings.prettier);
    }

    if (!this.fileManager.isFile(".gitignore")) {
      this.logger.info("Creating .gitignore...");
      this.fileManager.writeTextFile(".gitignore", "node_modules\n");
    }
  }

  async eslint() {
    this.logger.info("Creating eslint.config.mjs...");
    spawnSync("npm", ["init", "@eslint/config@latest"], {
      stdio: "inherit",
    });

    if (!this.fileManager.exists(".vscode")) {
      this.logger.info("Creating dir '.vscode'...");
      this.fileManager.mkdir(".vscode");
    }

    const currentSettings = this.fileManager.readJsonFile(
      "./.vscode/settings.json"
    );
    this.logger.debug("Current settings.json:", currentSettings);
    this.fileManager.writeJsonFile(".vscode/settings.json", {
      ...currentSettings,
      ...settings.editorSettings,
    });
  }

  async typescript() {
    this.logger.info(`Installing ${this.libs.ts}...`);

    spawnSync("npm", ["install", "--save-dev", ...this.libs.ts], {
      stdio: "inherit",
    });

    if (!this.fileManager.exists("tsconfig.json")) {
      this.logger.info("Creating tsconfig.json...");
      spawnSync("npx", ["tsc", "--init"], {
        stdio: "inherit",
      });
    }

    const currentTsConfig = this.fileManager.readJsonFile("tsconfig.json");
    this.logger.debug("Current tsConfig:", currentTsConfig);

    console.log("\n\rAdding tsconfig.json paths...\n");
    for (const [key, value] of Object.entries(settings.compilerOptions)) {
      console.log(`${key}:`, value);
    }
    console.log("\n");

    this.fileManager.writeJsonFile("tsconfig.json", {
      compilerOptions: {
        ...currentTsConfig.compilerOptions,
        ...settings.compilerOptions,
      },
    });

    this.logger.info("TypeScript installed successfully!");
  }
}

/**
 * @typedef {import("./fileManager.js").FileManager} FileManager
 */
