import { dirname, join, extname, resolve, basename } from "path";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  statSync,
  readdirSync,
} from "fs";
import { colors, Logger } from "./logger.js";
import { fileURLToPath } from "url";
import { cwd, stdout } from "process";

export class FileSystem {
  constructor() {
    this.logger = new Logger(FileSystem.name);
    this.allowedArchitectures = ["hexagonal", "clean", "mvc", "serverless"];
    this.filename = fileURLToPath(import.meta.url);
    this.dirname = dirname(this.filename);
  }

  showAllowedArchitectures() {
    return this.allowedArchitectures.join("|");
  }

  isValid(type) {
    return this.allowedArchitectures.includes(type);
  }

  existCurrentArchitectureFile() {
    this.logger.debug("Checking current structure...");
    const path = resolve(cwd() + `/architecture.json`);
    return existsSync(path);
  }

  listCurrentArchitectureSrc() {
    this.logger.debug("Checking current architecture...");
    const path = resolve(cwd() + `/src`);
    return readdirSync(path);
  }

  /**
   *
   * @param {string} type
   * @returns {object}
   */
  getByPattern(type) {
    try {
      const path = resolve(this.dirname + `/../patterns/${type}.json`);
      this.logger.info(`Reading from ${path}`);
      const content = readFileSync(path, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      this.logger.verbose(error);
      return undefined;
    }
  }

  pullStructure(dir) {
    const path = resolve(cwd() + "/" + dir);
    this.logger.info(`Pulling structure from "${path}"`);

    const output = {
      [basename(dir)]: this.#readRecursive(path),
    };

    return output;
  }

  /**
   * @returns {object}
   */
  readStructure() {
    try {
      const path = resolve(cwd() + `/architecture.json`);
      this.logger.info(`Reading from ${path}`);
      const content = readFileSync(path, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      this.logger.verbose(error);
      return undefined;
    }
  }

  /**
   * @param {object} structure
   * @returns {boolean}
   */
  copyStructure(structure) {
    try {
      const path = resolve(cwd() + `/architecture.json`);
      this.logger.info(`Copying to ${basename(path)}`);
      writeFileSync(path, JSON.stringify(structure, null, 2));
      return true;
    } catch (error) {
      this.logger.verbose(error);
      return false;
    }
  }

  /**
   * @param {object} structure
   * @returns {boolean}
   */
  generateStructure(structure) {
    this.logger.info("Generating structure...");
    this.#writeRecursive(structure);
    return true;
  }

  printStructure(structure, path = " ") {
    for (const [key, value] of Object.entries(structure)) {
      const lastKey = Object.keys(structure).pop();
      const line = [
        colors.dim,
        key === lastKey ? path.replace(/(├)(?!.*\1)/, "└") : path,
        colors.reset,
        colors.bright,
        extname(key).length === 0 ? `${key}/` : key,
        colors.reset,
      ].join("");
      stdout.write(line + "\n");
      if (typeof value === "object") {
        const symbol = " ├──";
        this.printStructure(value, symbol + path);
      }
    }
  }

  /** @private */
  #readRecursive(path = "") {
    const structure = {};
    for (const item of readdirSync(path).sort((_, b) =>
      extname(b).length > 0 ? -1 : 1
    )) {
      const currentPath = join(path, item);
      if (statSync(currentPath).isDirectory()) {
        structure[item] = this.#readRecursive(currentPath);
      } else {
        structure[item] = "";
      }
    }
    return structure;
  }

  /** @private */
  #writeRecursive(structure, path = "") {
    for (const [key, value] of Object.entries(structure)) {
      const currentPath = join(path, key);
      if (typeof value === "string") {
        this.#makeFile(currentPath, `// ${value}`);
      } else {
        this.#makeDir(currentPath);
        this.#writeRecursive(value, currentPath);
      }
    }
  }

  /** @private */
  #makeDir(path) {
    if (!existsSync(path)) {
      this.logger.debug(`Creating ${path}`);
      mkdirSync(path);
    } else {
      this.logger.verbose(`Directory ${path} already exists`);
    }
  }

  /** @private */
  #makeFile(path, value) {
    if (!existsSync(path) || !statSync(path).isFile()) {
      this.logger.info(`Add file ${path}`);
      writeFileSync(path, value);
    } else {
      this.logger.verbose(`File ${path} already exists`);
    }
  }
}
