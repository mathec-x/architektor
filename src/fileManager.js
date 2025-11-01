import { Logger, styled } from "./logger.js";
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { basename, dirname, join } from "path";
import { cwd } from "process";
import { FileJson } from "./value-objects/fileJson.js";
import { FileText } from "./value-objects/fileText.js";
import { DirEnt } from "./value-objects/dirEnt.js";

export class FileManager {
  constructor() {
    this.logger = new Logger(FileManager.name);
    this.filename = fileURLToPath(import.meta.url);
    this.dirname = dirname(join(this.filename, ".."));
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
   * @param {import("fs").PathLike} path
   */
  readTextFile(path) {
    return new FileText(path);
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
   * @param {{ encoding?: BufferEncoding; withFileTypes?: boolean | any; recursive?: boolean }} options
   */
  readdir(path, options = {}) {
    return readdirSync(path, { encoding: "utf8", ...options });
  }

  /**
   * @param {import("fs").PathLike} path
   * @param {string | ((name: string) => boolean)} [searchTerm]
   * @param {'isDirectory' | 'isFile'} [dirent='isDirectory']
   */
  scandir(path, searchTerm, dirent) {
    return new DirEnt(
      readdirSync(path, { recursive: true, encoding: "utf8", withFileTypes: true }),
      searchTerm,
      dirent
    );
  }

  /**
   * @param {string} source
   * @param {string} destination
   * @param {import("fs").CopySyncOptions} options
   */
  cpFromPackageToRepo(source, destination, options = {}, forceOverride = false) {
    source = join(this.dirname, source);
    destination = join(this.cwd, destination);
    if (this.exists(destination) && !forceOverride) {
      this.logger.warn(styled("gray", `Destination ${basename(destination)} already exists, skipping copy.`));
      return;
    }

    this.logger.info(styled("blue", `Copying ${basename(source)} to '${destination}'`));
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

  /**
   * 
   * @param {string} path 
   * @param  {...string} lines 
   */
  makeFileIfNotExists(path, ...lines) {
    if (!this.isFile(path)) {
      this.logger.info(`Add file ${path}`);
      this.writeTextFile(path, lines.join("\n"));
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
