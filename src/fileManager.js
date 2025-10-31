import { Logger, styled } from "./logger.js";
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { basename, dirname, join } from "path";
import { cwd } from "process";
import { FileJson } from "./fileJson.js";
import { FileText } from "./fileText.js";
import { Word } from "./word.js";

export class FileManager {
  constructor() {
    this.logger = new Logger(FileManager.name);
    this.words = new Word();
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
  scandir(path, searchTerm, dirent = "isDirectory") {
    let terms = undefined;
    if (typeof searchTerm === "string") {
      terms = [
        this.words.plural(this.words.sanitize(searchTerm)),
        this.words.singular(this.words.sanitize(searchTerm))
      ];
    }

    return readdirSync(path, { recursive: true, encoding: "utf8", withFileTypes: true })
      .filter((entry) => {
        if (entry[dirent]()) {
          if (!searchTerm) {
            return true;
          }

          if (typeof searchTerm === "function") {
            return searchTerm(entry.name);
          }

          const name = this.words.sanitize(entry.name);
          return terms.some((dir) => name === dir);
        }
        return false;
      })
      .map((entry) => `${entry.parentPath}/${entry.name}`);
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
      this.logger.verbose(`Destination ${basename(destination)} already exists, skipping copy.`);
      return;
    }

    this.logger.verbose(styled("blue", `Copying ${basename(source)} to '${destination}'`));
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
