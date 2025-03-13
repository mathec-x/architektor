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
  }

  /**
   *
   * @param {string} command
   * @param {readonly string[]} args
   * @param {import("child_process").SpawnSyncOptionsWithBufferEncoding} options
   */
  spawn(command, args, options = {}) {
    this.logger.debug("Spawn:", command, args);
    const result = spawnSync(command, args, { ...options, encoding: "utf-8" });
    if (result.error) {
      this.logger.error("Failed to run command:", result.error);
      return null;
    }
    return (result.stdout + result.stderr).trim();
  }

  async defaultConfig(nodeVersion) {
    this.fileManager.makeFileIfNotExists(".nvmrc", nodeVersion);

    const pkg = this.fileManager.readJsonFile("package.json");
    pkg.scripts = {
      ...pkg.scripts,
      ...settings.scripts(pkg.name),
    };
    pkg.saveJson();

    this.fileManager.makeJsonFileIfNotExists(".prettierrc", settings.prettier);
    this.fileManager.makeJsonFileIfNotExists(".gitignore", settings.gitignore);

    this.fileManager.cpFromPackageToRepo("/defaults/.dockerignore", ".dockerignore");
    this.fileManager.cpFromPackageToRepo("/defaults/Dockerfile", "Dockerfile");
    this.fileManager.cpFromPackageToRepo("/defaults/docker-compose.yml", "docker-compose.yml");

    for (const s of settings.stages) {
      if (!this.fileManager.isFile(`.env.${s}`)) {
        this.logger.info(`Creating .env.${s}....`);
        this.fileManager.writeTextFile(`.env.${s}`, `APPLICATION_NAME=myApp\nNODE_ENV=${s}\n`);
      }
    }
  }

  async eslint() {
    this.logger.info("Creating eslint.config.mjs...");

    spawnSync("npm", ["install", "--save-dev", ...settings.eslintLibs], {
      stdio: "inherit",
    });

    if (!this.fileManager.exists(".vscode")) {
      this.logger.info("Creating dir '.vscode'...");
      this.fileManager.mkdir(".vscode");
    }

    const currentSettings = this.fileManager.readJsonFile("./.vscode/settings.json");
    this.logger.debug("Current settings.json:", currentSettings);
    this.fileManager.writeJsonFile(".vscode/settings.json", {
      ...currentSettings,
      ...settings.editorSettings,
    });

    this.fileManager.cpFromPackageToRepo("/defaults/eslint.config.mjs", "eslint.config.mjs");
    this.logger.info("Eslint installed successfully!");
  }

  async typescript() {
    this.logger.info(`Installing ${settings.tsLibs}...`);

    spawnSync("npm", ["install", "--save-dev", ...settings.tsLibs], {
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

    currentTsConfig.compilerOptions = {
      ...currentTsConfig.compilerOptions,
      ...settings.compilerOptions,
    };

    currentTsConfig.saveJson();

    this.logger.info("TypeScript installed successfully!");
  }
}

/**
 * @typedef {import("./fileManager.js").FileManager} FileManager
 */
