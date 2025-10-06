import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    ignores: ["node_modules/", "defaults/"],
    rules: {
      "max-len": ["error", { code: 150 }],
      camelcase: "off",
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
];
