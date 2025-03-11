export const prompts = {
  alreadyExist:
    "A structure already exists in the repository, Do you want to overwrite file architecture.json?",
  tsInstall: (list) =>
    `Do you want to install the packages ${list} for typescript?`,
  eslintInstall: "Do you want to install eslint?",
  generate: "Do you want to generate the structure folders?",
  prettierInstall:
    "Do you want to add some configurations like prettierrc, .gitignore... ?",
};

export const settings = {
  prettier: {
    semi: true,
    singleQuote: true,
    trailingComma: "all",
    printWidth: 120,
    tabWidth: 2,
  },
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
