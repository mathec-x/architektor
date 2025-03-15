import { exit, stdin, stdout } from "process";
import { createInterface } from "readline";
import { Logger, styled } from "./logger.js";
import { spawnSync } from "child_process";

export class Prompt {
  constructor() {
    this.yesToAll = false;
    this.logger = new Logger(Prompt.name);
  }
  /**
   *
   * @param {string} command
   * @param {readonly string[]} args
   * @param {import("child_process").SpawnSyncOptionsWithBufferEncoding} options
   */
  spawn(command, args, options = {}) {
    this.logger.debug(`Spawn: ${command}`, args.join(" "));
    const result = spawnSync(command, args, { ...options, encoding: "utf-8" });
    if (result.error) {
      this.logger.error("Failed to run command:", result.error);
      return null;
    }
    return result.stdout || result.stderr ? (result.stdout + result.stderr).trim() : "";
  }

  async delay(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  /**
   * @param {string} question
   * @returns {Promise<string>}
   */
  async ask(question) {
    const rl = createInterface({
      input: stdin,
      output: stdout,
    });

    return new Promise((resolve) => {
      rl.question(styled("italic", question), (answer) => {
        resolve(answer);
        rl.close();
      });
    });
  }

  /**
   *
   * @param {string} question
   * @param {readonly string[]} options
   */
  async select(question, options) {
    const rl = this.#createReadLineInterface();
    let value;

    const format = styled("italic", ` > ${question}: `);
    const optionsFormat = ["Cancel"]
      .concat(options)
      .map((option, index) => {
        return `   ${index}. ${styled("cyan", option)}`;
      })
      .join("\n");

    stdout.write(format + "\n" + optionsFormat + "\n   > ");
    return new Promise((resolve) => {
      stdin.on("keypress", (answer) => {
        const index = parseInt(answer);
        value = options[index - 1];
        rl.close();
      });

      stdin.on("ready", () => {
        stdout.write(optionsFormat);
      });

      rl.on("close", () => {
        stdout.write("\n");
        resolve(value);
      });
    });
  }

  /**
   * @param {string} question
   * @returns {Promise<boolean>}
   */
  async confirm(question) {
    if (this.yesToAll) return true;

    const format = styled("italic", ` > ${question} (y|n|all): `);
    let value = false;
    const rl = this.#createReadLineInterface();

    stdout.write(format);
    return new Promise((resolve) => {
      stdin.on("keypress", (str) => {
        value = this.#parseInput(str);
        rl.close();
      });

      rl.on("close", () => {
        stdout.write("\n");
        resolve(value);
      });
    });
  }

  /**
   * @param {string} input
   */
  #parseInput(input) {
    if (input === "y") return true;
    if (input === "a") {
      this.yesToAll = true;
      return true;
    }

    return false;
  }

  #createReadLineInterface() {
    const rl = createInterface({
      input: stdin,
      output: stdout,
    });

    if (stdin.isTTY) {
      stdin.setRawMode(true);
    }

    rl.on("SIGINT", exit);
    rl.on("SIGCONT", exit);
    rl.on("SIGTSTP", exit);
    rl.on("SIGBREAK", exit);

    return rl;
  }
}
