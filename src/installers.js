import { settings } from "./constants.js";
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
    this.prompt.spawn("npm", this.prompt.install.dev(["@types/express"]), { stdio: "inherit" });
    this.prompt.spawn("npm", this.prompt.install.save(["express"]), { stdio: "inherit" });

    const dir = this.fileManager.scandir("src");

    if (dir.contains("adapters")) {
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/ExpressAdapter.md", "./src/adapters/http/express/ExpressAdapter.md");
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/ExpressAdapter.ts", "./src/adapters/http/express/ExpressAdapter.ts");
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/ExpressAdapter.spec.ts", "./src/adapters/http/express/ExpressAdapter.spec.ts");
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/ExpressRouteHandler.ts", "./src/adapters/http/express/ExpressRouteHandler.ts");
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/ExpressTestAdapter.ts", "./src/adapters/http/express/ExpressTestAdapter.ts");

      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/NotFoundException.ts", "./src/core/exceptions/NotFoundException.ts");
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/HttpErrorHandler.ts", "./src/adapters/http/errors/HttpErrorHandler.ts");
      this.fileManager.cpFromPackageToRepo(
        "/defaults/examples/express/HttpErrorHandler.spec.ts", "./src/adapters/http/errors/HttpErrorHandler.spec.ts"
      );

      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/bootstrap-adapter.ts", "./src/infrastructure/bootstrap/app.ts");
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/app-e2e.spec.ts", "./tests/app-e2e.spec.ts");
      this.fileManager.cpFromPackageToRepo("/defaults/examples/express/main.adapter.ts", "./src/main.ts");

      this.prompt.code("./src/infrastructure/bootstrap/app.ts");
      this.prompt.code("./src/main.ts");
      return;
    }
    // // clean with presentation
    // if (copies.includes("ExpressApp.ts"))
    //   this.fileManager.cpFromPackageToRepo("/defaults/examples/express/main.wpresentation.ts", "./src/main.ts");
    // // hexagonal adapter
    // if (copies.includes("ExpressAdapter.ts"))
    //   this.fileManager.cpFromPackageToRepo("/defaults/examples/express/main.wadapter.ts", "./src/main.ts");
    // // single ddd
    // if (copies.includes("ExpressServer.ts"))
    //   this.fileManager.cpFromPackageToRepo("/defaults/examples/express/main.wddd.ts", "./src/main.ts");
    // // mvc or clean without presentation
    // if (copies.includes("app.config.ts"))
    //   this.fileManager.cpFromPackageToRepo("/defaults/examples/express/main.wclean.ts", "./src/main.ts");
  }

  async zodSwaggerForExpress() {
    this.prompt.spawn("npm", this.prompt.install.dev(["@types/swagger-ui-express"]), { stdio: "inherit" });
    this.prompt.spawn("npm", this.prompt.install.save(["zod", "@asteasolutions/zod-to-openapi", "swagger-themes", "swagger-ui-express"]), {
      stdio: "inherit"
    });

    this.fileManager.cpFromPackageToRepo(
      "/defaults/examples/swagger/zodValidationMiddleware.ts", "./src/infrastructure/http/middlewares/zodValidationMiddleware.ts"
    );
    this.fileManager.cpFromPackageToRepo("/defaults/examples/swagger/setupSwagger.ts", "./src/adapters/http/openapi/setupSwagger.ts");
    this.fileManager.cpFromPackageToRepo("/defaults/examples/swagger/OpenApiAdapter.ts", "./src/adapters/http/openapi/OpenApiAdapter.ts");
    this.fileManager.cpFromPackageToRepo("/defaults/examples/swagger/OpenApiAdapter.spec.ts", "./src/adapters/http/openapi/OpenApiAdapter.spec.ts");
    this.fileManager.cpFromPackageToRepo("/defaults/examples/swagger/OpenApiTypes.ts", "./src/adapters/http/openapi/OpenApiTypes.ts");
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
}

/**
 * @typedef {import("./fileManager.js").FileManager} FileManager
 * @typedef {import("./prompt.js").Prompt} Prompt
 */
