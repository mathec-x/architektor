export const prompts = {
  alreadyExist:
    "A structure already exists in the repository, Do you want to overwrite file architecture.json?",
  tsInstall: (list) =>
    `Do you want to install the packages ${list} for typescript?`,
  eslintInstall: "Do you want to install eslint?",
  generate: "Do you want to generate the structure folders?",
  prettierInstall: "Do you want to configure prettierrc?",
};
