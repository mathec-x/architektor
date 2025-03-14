import { Logger } from "./logger.js";
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { cwd } from "process";
import { FileJson } from "./fileJson.js";

export class FileManager {
  constructor() {
    this.logger = new Logger(FileManager.name);
    this.filename = fileURLToPath(import.meta.url);
    this.dirname = dirname(this.filename);
    this.cwd = cwd();
  }

  /**
   * @template T
   * @param {import("fs").PathLike} path
   * @param {T} defaultValue
   */
  readJsonFile(path, defaultValue = undefined) {
    return new FileJson(path, defaultValue);
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
   * @param {{ encoding?: BufferEncoding; withFileTypes?: false; recursive?: boolean }} options
   */
  readdir(path, options = {}) {
    return readdirSync(path, { encoding: "utf8", ...options });
  }

  /**
   * @param {string} source
   * @param {string} destination
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

  makeJsonFileIfNotExists(path, value) {
    if (!this.isFile(path)) {
      this.logger.info(`Add file ${path}`);
      this.writeJsonFile(path, value);
    } else {
      this.logger.verbose(`File ${path} already exists`);
    }
  }
}
