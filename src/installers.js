import { settings } from "./constants.js";
import { Logger, styled } from "./logger.js";

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
    for (const s of settings.stages) {
      if (!this.fileManager.isFile(`.env.${s}`)) {
        this.logger.info(`Creating .env.${s}....`);
        this.fileManager.writeTextFile(`.env.${s}`, `APPLICATION_NAME=myApp\nNODE_ENV=${s}\n`);
      }
    }
  }

  async eslint() {
    this.logger.info("Creating eslint.config.mjs...");
    this.prompt.spawn("npm", this.prompt.install.dev(settings.eslintLibs), {
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

    /** 
     * @todo let dinamic copy  
     */
    this.fileManager.cpFromPackageToRepo("/defaults/eslint.config.hex.mjs", "eslint.config.mjs");
    this.logger.info("Eslint installed successfully!");
  }

  /**
   * @param {*} nodeVersion
   */
  async typescript(nodeVersion) {
    const { compilerOptions, tsLibs } = settings;
    this.prompt.spawn("npm", this.prompt.install.dev(tsLibs), {
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

    this.fileManager.cpFromPackageToRepo("/defaults/env.d.ts", "./src/@types/env.d.ts");

    currentTsConfig.set("compilerOptions", {
      ...currentTsConfig.get("compilerOptions"),
      ...compilerOptions,
    });
    currentTsConfig.save();
    await this.applyPackageJson(nodeVersion);
    this.logger.info("TypeScript installed successfully!");
  }

  async express() {
    this.prompt.spawn("npm", this.prompt.install.dev(["@types/express"]), {
      stdio: "inherit",
    });
    this.prompt.spawn("npm", this.prompt.install.save(["express"]), {
      stdio: "inherit",
    });
    const copies = this.copyExampleFiles();
    this.fileManager.cpFromPackageToRepo("/defaults/examples/express/ExpressAdapter.ts", "./src/adapters/http/ExpressAdapter.ts");
    this.fileManager.cpFromPackageToRepo("/defaults/examples/express/ExpressRouteAdapter.ts", "./src/adapters/http/ExpressRouteAdapter.ts");

    // clean with presentation
    if (copies.includes("ExpressApp.ts"))
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/main.wpresentation.ts", "./src/main.ts");
    // hexagonal adapter
    if (copies.includes("ExpressAdapter.ts"))
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/main.wadapter.ts", "./src/main.ts");
    // single ddd
    if (copies.includes("ExpressServer.ts"))
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/main.wddd.ts", "./src/main.ts");
    // mvc or clean without presentation
    if (copies.includes("app.config.ts"))
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/main.wclean.ts", "./src/main.ts");

    // e2e test
    if (!this.fileManager.isFile("./tests/app-e2e.spec.ts")) {
      this.fileManager.cpFromPackageToRepo("/defaults/examples/app-e2e.spec.ts", "tests/app-e2e.spec.ts", {
        recursive: true,
      });
    }
  }

  async loggerService() {
    this.fileManager.cpFromPackageToRepo("/defaults/examples/logger/LoggerAdapter.ts", "./src/adapters/logger/LoggerAdapter.ts");
    this.fileManager.cpFromPackageToRepo("/defaults/examples/logger/LoggerService.ts", "./src/application/services/logger/LoggerService.ts");
  }

  async docker() {
    this.fileManager.cpFromPackageToRepo("/defaults/examples/docker/.dockerignore", ".dockerignore");
    this.fileManager.cpFromPackageToRepo("/defaults/examples/docker/Dockerfile", "Dockerfile");
    this.fileManager.cpFromPackageToRepo("/defaults/examples/docker/docker-compose.yml", "docker-compose.yml");
  }

  copyExampleFiles() {
    const copies = [];
    if (this.fileManager.exists("src")) {
      const path = this.fileManager.dirname + "/defaults/examples";
      const exampleFiles = this.fileManager.readdir(path, {
        recursive: true,
      });
      console.log({ exampleFiles });
      for (const dir of this.fileManager.readdir("src", { recursive: true })) {
        console.log({ dir });
        const filename = exampleFiles.find((e) => dir.endsWith(e));
        if (!filename) continue;

        copies.push(filename);
        this.logger.info(`Copying example file: ${styled("white", "src/" + dir)}`);
        this.fileManager.cpFromPackageToRepo(`/defaults/examples/${filename}`, `src/${dir}`);
      }
    }
    return copies;
  }
}

/**
 * @typedef {import("./fileManager.js").FileManager} FileManager
 * @typedef {import("./prompt.js").Prompt} Prompt
 */
