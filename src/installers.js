import { prompts, settings } from "./constants.js";
import { Logger } from "./logger.js";

export class Installers {
  /**
   * @param {FileManager} fileManager
   * @param {Prompt} prompt
   */
  constructor(fileManager, prompt) {
    this.prompt = prompt;
    this.fileManager = fileManager;
    this.logger = new Logger(Installers.name);
  }

  async init() {
    const nodeVersion = this.prompt.spawn("node", ["--version"]);
    this.logger.alert(`Node version: ${nodeVersion}`);

    if (!this.fileManager.isFile("package.json")) {
      this.logger.info("Creating package.json...");
      this.prompt.spawn("npm", ["init"]);
    }

    if (await this.prompt.confirm(prompts.tsInstall)) {
      await this.prompt.delay(355);
      await this.typescript();
    }
    if (await this.prompt.confirm(prompts.eslintInstall)) {
      await this.prompt.delay(355);
      await this.eslint();
    }
    if (await this.prompt.confirm(prompts.defaultConfig)) {
      await this.prompt.delay(355);
      await this.defaultConfig(nodeVersion);
    }

    this.logger.info("Project initialized successfully!");
  }

  /**
   * @param {string} nodeVersion
   */
  async defaultConfig(nodeVersion) {
    this.fileManager.makeFileIfNotExists(".nvmrc", nodeVersion);

    const pkg = this.fileManager.readJsonFile("package.json", { scripts: {}, name: "" });
    this.logger.debug("Current package.json:", pkg.data);
    pkg.set("scripts", {
      ...settings.scripts(pkg.get("name")),
      ...pkg.data.scripts,
    });
    pkg.save();

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

    this.prompt.spawn("npm", ["install", "--save-dev", ...settings.eslintLibs], {
      stdio: "inherit",
    });

    if (!this.fileManager.exists(".vscode")) {
      this.logger.info("Creating dir '.vscode'...");
      this.fileManager.mkdir(".vscode");
    }

    const currentSettings = this.fileManager.readJsonFile("./.vscode/settings.json", {});
    this.logger.debug("Current settings.json:", currentSettings.data);
    this.fileManager.writeJsonFile(".vscode/settings.json", {
      ...settings.editorSettings,
      ...currentSettings.data,
    });

    this.fileManager.cpFromPackageToRepo("/defaults/eslint.config.mjs", "eslint.config.mjs");
    this.logger.info("Eslint installed successfully!");
  }

  async typescript() {
    this.logger.info(`Installing ${settings.tsLibs}...`);

    this.prompt.spawn("npm", ["install", "--save-dev", ...settings.tsLibs], {
      stdio: "inherit",
    });

    if (!this.fileManager.exists("tsconfig.json")) {
      this.logger.info("Creating tsconfig.json...");
      this.prompt.spawn("npx", ["tsc", "--init"], {
        stdio: "inherit",
      });
    }

    const currentTsConfig = this.fileManager.readJsonFile("tsconfig.json", { compilerOptions: {} });
    this.logger.debug("Current tsConfig:", currentTsConfig.data);

    console.log("\n\rAdding tsconfig.json paths...\n");
    for (const [key, value] of Object.entries(settings.compilerOptions)) {
      console.log(`${key}:`, value);
    }
    console.log("\n");

    currentTsConfig.set("compilerOptions", {
      ...settings.compilerOptions,
      ...currentTsConfig.get("compilerOptions"),
    });
    currentTsConfig.save();

    this.logger.info("TypeScript installed successfully!");
  }
}

/**
 * @typedef {import("./fileManager.js").FileManager} FileManager
 * @typedef {import("./prompt.js").Prompt} Prompt
 */
