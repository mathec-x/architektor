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
    this.allowedArchitectures = Object.freeze(["hexagonal", "clean", "mvc", "serverless"]);
    this.filename = fileURLToPath(import.meta.url);
    this.dirname = dirname(join(this.filename, ".."));
  }

  getStarterEntry(structure, path = "./") {
    const arr = Object.entries(structure).sort((a) => (extname(a[0]) ? -1 : 1));
    for (const [key, value] of arr) {
      if (extname(key)) {
        return path + key;
      } else {
        return this.getStarterEntry(value, path + key + "/");
      }
    }
    return null;
  }

  showAllowedArchitectures() {
    return this.allowedArchitectures.join("|");
  }

  isValid(type) {
    return this.allowedArchitectures.includes(type);
  }

  existCurrentArchitectureFile() {
    this.logger.debug("Checking current structure...");
    const path = resolve(cwd() + "/architecture.json");
    return this.fileManager.exists(path);
  }

  /**
   *
   * @param {string} type
   */
  getByPattern(type) {
    try {
      const path = resolve(this.dirname + `/patterns/${type}.json`);
      this.logger.debug(`Reading from ${path}`);
      const { data } = this.fileManager.readJsonFile(path, {});
      return data;
    } catch (error) {
      this.logger.verbose(error);
      return undefined;
    }
  }

  /**
   *
   * @param {*} dir
   * @param {string[]} ignore
   */
  pullStructure(dir, ignore = []) {
    try {
      const path = resolve(cwd(), dir);
      this.logger.info(`Pulling structure from "${path}"`);
      const regex = new RegExp(ignore.map((e) => e.replace(".", "\\.")).join("|"), "gi");
      this.logger.verbose(`ignores: [${ignore}] => ${regex}`);
      const output = {
        [basename(dir)]: this.#readRecursive(path, regex),
      };

      return output;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  readCurrentFileStructure() {
    try {
      const path = resolve(cwd() + "/architecture.json");
      this.logger.info(`Reading from ${path}`);
      const { data } = this.fileManager.readJsonFile(path, {});
      return data;
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
      const path = resolve(cwd() + "/architecture.json");
      this.logger.debug(`Copying to ${basename(path)}`);
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
        typeof value === "string" ? `${colors.green}${colors.tab(9)}${value}${colors.reset}` : "",
      ].join("");
      stdout.write(line + "\n");
      if (typeof value === "object") {
        const symbol = " ├──";
        this.printStructure(value, symbol + path);
      }
    }
  }

  /**
   * @param {string} path
   * @param {RegExp | undefined} regex
   */
  #readRecursive(path = "", regex = undefined) {
    try {
      const structure = {};

      for (const item of this.fileManager.readdir(path).sort((_, b) => (extname(b).length > 0 ? -1 : 1))) {
        const baseName = basename(item);
        const currentPath = join(path, item);

        if (regex && (baseName.match(regex) || baseName.startsWith("."))) {
          this.logger.debug(`Ignore path: ${path} => ${baseName}`);
          continue;
        }

        this.logger.verbose(`Readin path: ${path} => ${baseName}`);
        if (this.fileManager.isFile(currentPath)) {
          structure[item] = `${baseName}`;
        } else {
          structure[item] = this.#readRecursive(currentPath, regex);
        }
      }
      return structure;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

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
