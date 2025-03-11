export const prompts = {
  alreadyExist:
    "A structure already exists in the repository, Do you want to overwrite file architecture.json?",
  tsInstall: (list) =>
    `Do you want to install the packages ${list} for typescript?`,
  eslintInstall: "Do you want to install eslint?",
  generate: "Do you want to generate the structure folders?",
  prettierInstall: "Do you want to configure prettierrc?",
};

export const settings = {
  editorSettings: {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit",
    },
    "explorer.fileNesting.enabled": true,
    "explorer.fileNesting.patterns": {
      "package.json": [
        "architecture.json",
        ".nvmrc",
        "package*",
        "yarn*",
        "pnpm*",
        "bun*",
        "prettier*",
        ".eslintrc.js",
        ".prettier*",
        ".env*",
        ".git*",
        "eslint*",
        ".eslint*",
        "tsconfig*",
        "jsconfig*",
        "config*",
      ].join(", "),
    },
  },
  compilerOptions: {
    esModuleInterop: true,
    resolveJsonModule: true,
    strictNullChecks: true,
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"],
    },
  },
};
