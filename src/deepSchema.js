const COLORS = {
  reset: "\x1b[0m",
  cyan: "\x1b[96m",
  yellow: "\x1b[93m",
  green: "\x1b[92m",
  gray: "\x1b[90m",
};

function supportsColor() {
  if (process.env.FORCE_COLOR === "1") return true;
  if (process.env.NO_COLOR) return false;
  return Boolean(process.stdout.isTTY);
}

function colorize(text, color, enabled) {
  if (!enabled || !COLORS[color]) return text;
  return COLORS[color] + text + COLORS.reset;
}

export class DeepSchema {

  /**
   * Entry point
   * ======================= 
   * @param {object} document
   * */
  execute(document) {
    let schema;

    if (Array.isArray(document)) {
      schema = {};
      for (const item of document) {
        this.mergeSchema(schema, this.recursive(item));
      }
    } else {
      schema = this.recursive(document);
    }

    // 🔥 decisão final acontece AQUI
    this.finalizeSchema(schema);

    return this.sortKeys(schema);
  }

  /**
   * Utils
   * ======================= 
   * @param {any} value
   * */
  getType(value) {
    return Object.prototype.toString.call(value).replace("object ", "");
  }

  /**
   * Concat coleta de valores
   * ======================= 
   * @param {object} old
   * @param {string} newValue
   * */
  concat(old, newValue) {
    const values = old?.__values ?? new Set();
    values.add(newValue);

    return { __values: values };
  }

  /** 
   * Decide o tipo final da string
   * =======================
   * @param {object} meta
   * */
  finalizeStringType(meta) {
    if (!meta?.__values) return "string";

    const values = [...meta.__values];

    // exatamente 2 valores → union literal
    if (values.length > 1 && values.length < 3) {
      return values.map(v => `'${v}'`).join(" | ");
    }

    // 0, 1 ou 3+ → string genérica
    return "string";
  }


  /**
   * Inferência de arrays
   * =======================
   * @param {any[]} array
   * */
  inferArray(array) {
    if (!array.length) return "any";

    const types = new Set(array.map(v => this.getType(v)));

    if (types.size === 1) {
      const type = [...types][0];

      if (type === "[String]") return "string";
      if (type === "[Number]") return "number";
      if (type === "[Date]") return "Date";
      if (type === "[Object]") return this.execute(array[0]);
    }

    return "any";
  }

  /**
   * Merge de schemas
   * ======================= 
   * @param {object} target
   * @param {object} source
   * */
  mergeSchema(target, source) {
    for (const key in source) {
      if (!target[key]) {
        target[key] = source[key];
      } else if (
        typeof target[key] === "object" &&
        typeof source[key] === "object" &&
        !Array.isArray(target[key])
      ) {
        this.mergeSchema(target[key], source[key]);
      }
    }
  }

  /** 
   * Recursão principal
   * ======================= 
   * @param {object} object
   * */

  recursive(object) {
    const schema = {};

    for (const key in object) {
      if (!Object.prototype.hasOwnProperty.call(object, key)) continue;

      const value = object[key];
      const type = this.getType(value);

      if (key === "_id") {
        schema[key] = "ObjectId(string)";
        continue;
      }

      if (type === "[String]") {
        schema[key] = this.concat(schema[key], value);
        continue;
      }

      if (type === "[Number]") {
        schema[key] = "number";
        continue;
      }

      if (type === "[Date]") {
        schema[key] = "Date";
        continue;
      }

      if (type === "[Array]") {
        schema[key] = [];
        schema[key][0] = this.inferArray(value);
        continue;
      }

      if (type === "[Object]") {
        schema[key] = this.execute(value);
        continue;
      }

      schema[key] = typeof value;
    }

    return schema;
  }

  /** 
   * Finalização do schema
   * ======================= 
   * @param {object} schema
   * */

  finalizeSchema(schema) {
    for (const key in schema) {
      const value = schema[key];

      // string com valores coletados
      if (value?.__values instanceof Set) {
        schema[key] = this.finalizeStringType(value);
        continue;
      }

      // array de objeto
      if (Array.isArray(value) && typeof value[0] === "object") {
        this.finalizeSchema(value[0]);
        continue;
      }

      // objeto aninhado
      if (typeof value === "object" && !Array.isArray(value)) {
        this.finalizeSchema(value);
      }
    }
  }

  /** 
   * Ordenação (inalterada)
   * ======================= 
   * @param {object} unordered
   * */

  sortKeys(unordered) {
    return Object.keys(unordered)
      .sort((a, b) => a.localeCompare(b))
      .reduce((obj, key) => {
        const type = this.getType(unordered[key]);
        obj[key] =
          type === "[Object]"
            ? this.sortKeys(unordered[key])
            : unordered[key];
        return obj;
      }, {});
  }

  /** 
   * Output TS Interface
   * ======================= 
   * @param {object} obj
   * @param {number} indent
   * */

  toTSInterface(obj, indent = 2) {
    const useColors = supportsColor();
    const space = " ".repeat(indent);

    return `{\n${Object.entries(obj)
      .map(([key, value]) => {
        const k = colorize(key, "cyan", useColors);

        if (typeof value === "string") {
          return `${space}${k}: ${colorize(value, "green", useColors)};`;
        }

        if (Array.isArray(value)) {
          const type =
            typeof value[0] === "string"
              ? value[0]
              : this.toTSInterface(value[0], indent + 2);
          return `${space}${k}: ${type}[];`;
        }

        return `${space}${k}: ${this.toTSInterface(value, indent + 2)};`;
      })
      .join("\n")}\n${" ".repeat(indent - 2)}}`;
  }

  /**
   * Log final
   * ======================= 
   * @param {object} data
   * @param {string} title
   * */

  logSchemaInterface(data, title = "params") {
    const result = this.execute(data);
    const useColors = supportsColor();

    title = `I${title.charAt(0).toUpperCase()}${title.slice(1)}`;

    console.log(
      colorize("interface", "cyan", useColors),
      colorize(title, "green", useColors),
      this.toTSInterface(result)
    );
  }
}

