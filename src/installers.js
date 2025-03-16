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
      this.logger.info("Init Node project...");

      this.prompt.spawn("npm", this.install.init(), {
        stdio: "inherit",
        input: "y\n",
      });
    }

    if (await this.prompt.confirm(prompts.tsInstall)) {
      await this.prompt.delay(355);
      await this.typescript(nodeVersion);
    }
    if (await this.prompt.confirm(prompts.eslintInstall)) {
      await this.prompt.delay(355);
      await this.eslint();
    }
    if (await this.prompt.confirm(prompts.defaultConfig)) {
      await this.prompt.delay(355);
      await this.defaultConfig();
    }

    this.logger.info("Project initialized successfully!");
  }

  /**
   * @param {string} nodeVersion
   */
  async applyPackageJson(nodeVersion) {
    const pkg = this.fileManager.readJsonFile("package.json", { scripts: {}, name: "", main: "", engines: {} });
    this.logger.debug("Current package.json:", pkg.data);
    pkg.set("main", "dist/main.js");
    pkg.set("engines", { node: nodeVersion.replace("v", ">=") });
    pkg.set("scripts", {
      ...pkg.data.scripts,
      ...settings.scripts,
    });
    pkg.save();
    this.fileManager.makeFileIfNotExists(".nvmrc", nodeVersion);
    this.logger.info("Package.json updated successfully!");

    // create readme
    if (!this.fileManager.exists("README.md")) {
      const readme = this.fileManager.readTextFile(this.fileManager.dirname + "/defaults/readme");
      readme.set("{app_name}", pkg.data.name);
      readme.set("{node_version}", nodeVersion);
      this.fileManager.writeTextFile("README.md", readme.content);
      this.logger.info("Readme created successfully!");
    }
  }

  async defaultConfig() {
    this.fileManager.makeJsonFileIfNotExists(".prettierrc", settings.prettier);
    this.fileManager.makeFileIfNotExists(".gitignore", settings.gitignore);
    this.fileManager.cpFromPackageToRepo("/defaults/jest.config.js", "jest.config.js");
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
    this.prompt.spawn("npm", this.install.dev(settings.eslintLibs), {
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

  /**
   * @param {*} nodeVersion
   */
  async typescript(nodeVersion) {
    const { compilerOptions, tsLibs } = settings;

    this.logger.info(`Installing ${tsLibs}...`);

    this.prompt.spawn("npm", this.install.dev(tsLibs), {
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
    for (const [key, value] of Object.entries(compilerOptions)) {
      console.log(`${key}:`, value);
    }
    console.log("\n");

    currentTsConfig.set("compilerOptions", {
      ...currentTsConfig.get("compilerOptions"),
      ...compilerOptions,
    });
    currentTsConfig.save();
    await this.applyPackageJson(nodeVersion);
    this.logger.info("TypeScript installed successfully!");
  }

  /**
   *
   * @param {string} framework
   */
  async installFramework(framework) {
    let mainEntry;
    this.logger.info(`Installing ${framework}...`);
    switch (framework) {
      case "Express":
        this.prompt.spawn("npm", this.install.dev(["@types/express"]), {
          stdio: "inherit",
        });
        this.prompt.spawn("npm", this.install.save(["express"]), {
          stdio: "inherit",
        });
        mainEntry = this.fileManager.readdir("./src", { recursive: true }).find((e) => e.endsWith("app.config.ts"));
        if (mainEntry) {
          this.fileManager.cpFromPackageToRepo("/defaults/express/app.config.ts", `src/${mainEntry}`);
        }
        this.fileManager.cpFromPackageToRepo("/defaults/express/app-e2e.spec.ts", "tests/app-e2e.spec.ts");
        break;
      default:
        this.logger.error("Invalid framework:", framework);
        break;
    }
  }

  install = {
    init: () => {
      const args = ["init"];
      if (this.prompt.yesToAll) args.push("-y");
      return args;
    },
    /**
     * @param {string[]} libs
     */
    save: (libs) => {
      return ["install", "--save", ...libs]; // --save is default but it's good to be explicit here
    },
    /**
     * @param {string[]} libs
     */
    dev: (libs) => {
      return ["install", "--save-dev", ...libs];
    },
  };
}

/**
 * @typedef {import("./fileManager.js").FileManager} FileManager
 * @typedef {import("./prompt.js").Prompt} Prompt
 */
