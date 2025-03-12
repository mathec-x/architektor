import { argv, pid } from "process";
import { inspect } from "util";

export const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  striked: "\x1b[9m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  tab: (n) => "\r" + "\t".repeat(n),
};

function debug(level, object) {
  if (object && ["DEBUG", "ERROR"].includes(level)) {
    return inspect(object, { colors: true, depth: 4, maxStringLength: 75 });
  }

  return "";
}

const parsePascalCase = (label) => {
  return label
    ? label
        .replace(/[_\-\s]+/g, " ")
        .replace(/(^\w|\b\w)/g, (match) => match.toUpperCase())
        .replace(/\s+/g, "")
    : undefined;
};

export class Logger {
  constructor(name) {
    const defaultlevel =
      argv.includes("-v") || argv.includes("--verbose") ? "VERBOSE" : "INFO";
    this.name = parsePascalCase(name);
    this.colors = {
      ALERT: colors.cyan,
      ERROR: colors.red,
      WARN: colors.yellow,
      INFO: colors.green,
      DEBUG: colors.magenta,
      VERBOSE: colors.gray,
    };
    this.level = defaultlevel;
    this.levels = Object.keys(this.colors).reverse();
  }

  logGroup() {
    console.time(this.name);
    console.group(this.name);
  }

  logGroupEnd() {
    console.groupEnd();
    console.timeEnd(this.name);
  }

  /**
   * Logs a message with the specified level and metadata.
   * @param {string} message - The message to log.
   * @param {any} metadata - Additional metadata to log.
   * @param {'INFO' | 'ALERT' | 'ERROR' | 'WARN' | 'DEBUG' | 'VERBOSE'} level - The log level.
   */
  log(message, data, level = "INFO") {
    const date = Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());

    const lvfrmt = level.toUpperCase().padStart(7, " ");

    return console.log(
      `${date} ${pid} - %s${lvfrmt} %s[${this.name}] %s${message} %s${debug(
        level,
        data
      )}`,
      this.colors[level],
      this.colors.WARN,
      this.colors[level],
      colors.reset
    );
  }

  verbose(message, data) {
    if (this.isVerboseEnabled()) {
      this.log(message, data, "VERBOSE");
    }
  }

  debug(message, data) {
    if (this.isDebugEnabled()) {
      this.log(message, data, "DEBUG");
    }
  }

  info(message, data) {
    if (this.isInfoEnabled()) {
      this.log(message, data, "INFO");
    }
  }

  warn(message, data) {
    if (this.isWarnEnabled()) {
      this.log(message, data, "WARN");
    }
  }

  error(message, data) {
    if (this.isErrorEnabled()) {
      this.log(message, data, "ERROR");
    }
  }

  alert(message, data) {
    if (this.isAlertEnabled()) {
      this.log(message, data, "ALERT");
    }
  }

  isVerboseEnabled() {
    return this.levels.indexOf(this.level) <= this.levels.indexOf("VERBOSE");
  }

  isDebugEnabled() {
    return this.levels.indexOf(this.level) <= this.levels.indexOf("DEBUG");
  }

  isInfoEnabled() {
    return this.levels.indexOf(this.level) <= this.levels.indexOf("INFO");
  }

  isWarnEnabled() {
    return this.levels.indexOf(this.level) <= this.levels.indexOf("WARN");
  }

  isErrorEnabled() {
    return this.levels.indexOf(this.level) <= this.levels.indexOf("ERROR");
  }

  isAlertEnabled() {
    return this.levels.indexOf(this.level) <= this.levels.indexOf("ALERT");
  }
}
