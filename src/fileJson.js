import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import { Logger } from "./logger.js";

/**
 * @template T
 */
export class FileJson {
  #path;
  #default;
  data;
  error;
  /**
   * @arg {PathLike} path
   * @arg {T} defaultValue
   */
  constructor(path, defaultValue = undefined) {
    this.logger = new Logger(FileJson.name);
    this.#path = path;
    this.#default = defaultValue;
    this.data = this.#load();
    this.error = null;
  }

  /**
   * @returns {Partial<T>}
   */
  #load() {
    try {
      if (existsSync(this.#path) && statSync(this.#path).isFile()) {
        return JSON.parse(readFileSync(this.#path, "utf8"));
      }
      this.logger.verbose(`File ${this.#path} does not exist`);
    } catch (err) {
      try {
        this.logger.verbose(`Trying to parse ${this.#path} as JSON ${err}`);
        return JSON.parse(readFileSync(this.#path, "utf8").replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, ""));
      } catch (error) {
        this.error = error;
      }
    }
    return this.#default;
  }

  /**
   * @template {keyof T} P
   * @arg {P} prop
   * @arg {T[P]} value
   */
  set(prop, value) {
    this.data[prop] = value;
  }

  /**
   * @arg {keyof T} prop
   */
  get(prop) {
    return this.data[prop];
  }

  save() {
    return writeFileSync(this.#path, JSON.stringify(this.data, null, 2));
  }
}

/**
 * @typedef {import("fs").PathLike} PathLike
 */
