import { dirname, join, extname, resolve, basename } from "path";

import { colors, Logger } from "./logger.js";
import { fileURLToPath } from "url";
import { cwd, stdout } from "process";

export class FileSystem {
  /**
   * @param {FileManager} fileManager
   */
  constructor(fileManager) {
    this.fileManager = fileManager;
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
    return this.fileManager.exists(path);
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
      return this.fileManager.readJsonFile(path);
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
  readCurrentFileStructure() {
    try {
      const path = resolve(cwd() + `/architecture.json`);
      this.logger.info(`Reading from ${path}`);
      return this.fileManager.readJsonFile(path);
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
      this.fileManager.writeJsonFile(path, structure);
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
        extname(key).length === 0 ? `${key}/` : key,
        colors.reset,
        typeof value === "string"
          ? `${colors.green}${colors.tab(9)}${value}${colors.reset}`
          : "",
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
    for (const item of this.fileManager
      .readdir(path)
      .sort((_, b) => (extname(b).length > 0 ? -1 : 1))) {
      const currentPath = join(path, item);
      if (this.fileManager.isDirectory(currentPath)) {
        structure[item] = this.#readRecursive(currentPath);
      } else {
        structure[item] = "";
      }
    }
    return structure;
  }

  /** @private */
  #writeRecursive(structure, path = "") {
    if (typeof structure === "string") {
      this.logger.verbose(`Structure is string for path: ${path}`);
      return;
    }

    for (const [key, value] of Object.entries(structure)) {
      const currentPath = join(path, key);
      if (typeof value === "string" && !!extname(key)) {
        this.fileManager.makeFileIfNotExists(currentPath, `// ${value}`);
      } else {
        this.fileManager.makeDirIfNotExists(currentPath);
        this.#writeRecursive(value, currentPath);
      }
    }
  }
}

/**
 * @typedef {import("./fileManager.js").FileManager} FileManager
 */
