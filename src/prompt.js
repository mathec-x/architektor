import { stdin, stdout } from "process";
import { createInterface } from "readline";
import { colors } from "./logger.js";

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
      rl.question(colors.italic + question + colors.reset, (answer) => {
        resolve(answer);
        rl.close();
      });
    });
  }

  /**
   * @param {string} question
   * @returns {Promise<boolean>}
   */
  async confirm(question) {
    const format =
      colors.italic + "  > " + question + colors.reset + " (y/n): ";

    return new Promise((resolve) => {
      const rl = createInterface({
        input: stdin,
        output: stdout,
      });
      const exit = () => {
        resolve(false);
        rl.close();
      };
      rl.on("SIGINT", exit);
      rl.on("SIGCONT", exit);
      rl.on("SIGTSTP", exit);
      rl.on("SIGBREAK", exit);
      if (stdin.isTTY) {
        stdin.setRawMode(true);
      }
      stdout.write(format);
      stdin.on("keypress", (str) => {
        const value = str && str.toLowerCase().startsWith("y") ? true : false;
        stdout.write(` - ${value ? "Ok" : "Nop"}`, () => {
          console.log("");
          rl.close();
          return resolve(value);
        });
      });
    });
  }
}
