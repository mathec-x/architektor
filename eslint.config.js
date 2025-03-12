import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    ignorePatterns: ["node_modules/", "dist/", "defaults"],
    rules: {
      "max-len": ["error", { code: 120 }],
      camelcase: "off",
      semi: ["error", "always"],
      quotes: ["error", "single"],
    },
  },
];
