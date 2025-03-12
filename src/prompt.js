import { exit, stdin, stdout } from "process";
import { createInterface } from "readline";
import { colors, styled } from "./logger.js";

export class Prompt {
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
   * @param {string[]} arrOptions
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
    const format = styled("italic", ` > ${question} (y/n): `);
    let value = false;
    const rl = this.#createReadLineInterface();

    stdout.write(format);
    return new Promise((resolve) => {
      stdin.on("keypress", (str) => {
        value = str && str.toLowerCase().startsWith("y") ? true : false;
        rl.close();
      });

      rl.on("close", () => {
        stdout.write("\n");
        resolve(value);
      });
    });
  }

  /** @private */
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
