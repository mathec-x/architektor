import { Logger } from "./logger.js";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { cwd } from "process";

class FILE {
  #path;
  constructor(path, metadata) {
    this.#path = path;
    Object.assign(this, metadata);
  }

  saveJson() {
    return writeFileSync(this.#path, JSON.stringify(this, null, 2));
  }
  saveText() {
    return writeFileSync(this.#path, this);
  }
}

export class FileManager {
  constructor() {
    this.logger = new Logger(FileManager.name);
    this.filename = fileURLToPath(import.meta.url);
    this.dirname = dirname(this.filename);
    this.cwd = cwd();
  }

  /**
   * @param {import("fs").PathOrFileDescriptor} path
   */
  readFile(path) {
    try {
      return new FILE(path, readFileSync(path, "utf8"));
    } catch (error) {
      this.logger.verbose(error);
      return new FILE(path, "");
    }
  }

  /**
   * @param {import("fs").PathOrFileDescriptor} path
   */
  readJsonFile(path) {
    try {
      return new FILE(
        path,
        JSON.parse(
          readFileSync(path, "utf8").replace(
            /\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm,
            ""
          )
        )
      );
    } catch (error) {
      this.logger.verbose(error);
      return new FILE(path, {});
    }
  }

  /**
   * @param {import("fs").PathOrFileDescriptor} path
   * @param {any} data
   */
  writeJsonFile(path, data) {
    return writeFileSync(path, JSON.stringify(data, null, 2));
  }

  /**
   * @param {import("fs").PathOrFileDescriptor} path
   * @param {string} data
   */
  writeTextFile(path, data) {
    return writeFileSync(path, data);
  }

  /**
   * @param {import("fs").PathLike} path
   * @param {{ encoding: BufferEncoding | null; withFileTypes?: false | undefined; recursive?: boolean | undefined }} options
   */
  readdir(path, options = {}) {
    return readdirSync(path, options);
  }

  /**
   * @param {string | URL} source
   * @param {string | URL} destination
   * @param {import("fs").CopySyncOptions} options
   */
  cpFromPackageToRepo(source, destination, options = {}) {
    source = join(this.dirname, "..", source);
    destination = join(this.cwd, destination);
    this.logger.verbose(`Copying ${source} to ${destination}`);
    return cpSync(source, destination, options);
  }

  /**
   * @param {import("fs").PathLike} path
   */
  exists(path) {
    return existsSync(path);
  }

  /**
   * @param {import("fs").PathLike} path
   */
  isDirectory(path) {
    return existsSync(path) && statSync(path).isDirectory();
  }

  /**
   * @param {import("fs").PathLike} path
   */
  isFile(path) {
    return existsSync(path) && statSync(path).isFile();
  }

  /**
   * @param {import("fs").PathLike} path
   * @param {import("fs").MakeDirectoryOptions} options
   */
  mkdir(path, options = {}) {
    return mkdirSync(path, options);
  }

  makeDirIfNotExists(path) {
    if (!this.exists(path)) {
      this.logger.info(`Creating ${path}`);
      this.mkdir(path);
    } else {
      this.logger.verbose(`Directory ${path} already exists`);
    }
  }

  makeFileIfNotExists(path, value) {
    if (!this.isFile(path)) {
      this.logger.info(`Add file ${path}`);
      this.writeTextFile(path, value);
    } else {
      this.logger.verbose(`File ${path} already exists`);
    }
  }
}
