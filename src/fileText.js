import { readFileSync, writeFileSync } from "fs";
import { Logger } from "./logger.js";

export class FileText {
  #path;
  content;
  error;
  /**
   * @arg {PathLike} path
   */
  constructor(path) {
    this.logger = new Logger(FileText.name);
    this.#path = path;
    this.content = this.#load();
    this.error = null;
  }

  #load() {
    try {
      return readFileSync(this.#path, "utf8");
    } catch (err) {
      this.logger.verbose(`File ${this.#path} error ${err}`);
      this.error = err;
      return "";
    }
  }

  /**
   * @arg {string} prop
   * @arg {string} value
   */
  set(prop, value) {
    const regexp = new RegExp(prop, "g");
    this.logger.debug(`Setting text '${prop}' to '${value}'`, { regexp });
    this.content = this.content.replace(regexp, value);
  }

  save() {
    return writeFileSync(this.#path, this.content);
  }
}

/**
 * @typedef {import("fs").PathLike} PathLike
 */
