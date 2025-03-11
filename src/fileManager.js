import { Logger } from "./logger.js";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "fs";

export class FileManager {
  constructor() {
    this.logger = new Logger(FileManager.name);
  }

  /**
   * @param {import("fs").PathOrFileDescriptor} path
   */
  readJsonFile(path) {
    try {
      return JSON.parse(
        readFileSync(path, "utf8").replace(
          /\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm,
          ""
        )
      );
    } catch {
      return {};
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
