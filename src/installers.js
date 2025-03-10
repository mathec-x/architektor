import { Logger } from "./logger.js";
import { spawnSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";

export class Installers {
  constructor() {
    this.logger = new Logger(Installers.name);
    this.libs = {
      ts: ["@types/node", "typescript", "tsconfig-paths", "tsx", "tsup"],
    };
  }

  async eslint() {
    this.logger.info("Creating eslint.config.mjs...");
    spawnSync("npm", ["init", "@eslint/config@latest"], {
      stdio: "inherit",
    });
  }

  async typescript() {
    this.logger.info(`Installing ${this.libs.ts}...`);
    spawnSync("npm", ["install", "--save-dev", ...this.libs.ts], {
      stdio: "inherit",
    });
    console.log();

    if (!existsSync("tsconfig.json")) {
      this.logger.info("Creating tsconfig.json...");
      spawnSync("npx", ["tsc", "--init"], {
        stdio: "inherit",
      });
    }

    const currentTsConfig = readFileSync("tsconfig.json", "utf8");
    const tsConfig = JSON.parse(
      currentTsConfig.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "")
    );

    writeFileSync(
      "tsconfig.json",
      JSON.stringify(
        {
          compilerOptions: {
            ...(tsConfig?.compilerOptions || {}),
            esModuleInterop: true,
            resolveJsonModule: true,
            strictNullChecks: true,
            baseUrl: ".",
            paths: {
              "@/*": ["./src/*"],
            },
          },
        },
        null,
        2
      )
    );

    this.logger.info("TypeScript installed successfully!");
  }
}
