import { readFileSync, rmSync, writeFileSync } from "fs";
import { Logger } from "../logger.js";

export class FileText {
  #path;
  #logger;
  content;
  error;
  /**
   * @arg {PathLike} path
   */
  constructor(path) {
    this.#logger = new Logger(FileText.name);
    this.#path = path;
    this.content = this.#load();
    this.error = null;
  }

  #load() {
    try {
      return readFileSync(this.#path, "utf8");
    } catch (err) {
      this.#logger.info(`File ${this.#path} on load ${err.message}`);
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
    this.#logger.debug(`Setting text '${prop}' to '${value}'`, { regexp });
    this.content = this.content.replace(regexp, value);
  }

  appendLine(text) {
    if (text) {
      this.content += "\n" + text;
      this.save();
    }
  }

  save() {
    return writeFileSync(this.#path, this.content);
  }

  rm() {
    try {
      return rmSync(this.#path);
    } catch (error) {
      this.#logger.info(`File ${this.#path} on delete error ${error.message}`);
    }
  }

  /**
   * @arg {string} prop
   */
  getLine(prop) {
    const regexp = new RegExp(prop + "[^\\r\\n]+", "g");
    const matches = this.content.match(regexp);
    return matches?.[0];
  }

  lines() {
    return this.content.split(/\r?\n/).length;
  }
}

/**
 * @typedef {import("fs").PathLike} PathLike
 */
