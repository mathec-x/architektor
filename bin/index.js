#!/usr/bin/env node

import { prompts } from "#core/constants";
import { FileManager } from "#core/fileManager";
import { FileSystem } from "#core/fileSystem";
import { Installers } from "#core/installers";
import { Logger } from "#core/logger";
import { Prompt } from "#core/prompt";
import { Command } from "commander";
import { exit } from "process";

const name = "architect";
const version = "0.0.1";

const fileManager = new FileManager();
const fileSystem = new FileSystem(fileManager);
const installers = new Installers(fileManager);
const prompt = new Prompt();
const program = new Command(name);

program
  .command("pull")
  .version(version)
  .description("Generate structure file architecture.json from current project")
  .argument("<path>", "Path to the project root directory ex: ./src")
  .action(async (path) => {
    const logger = new Logger("pull");
    const prompts = {
      save: "Do you want to save this structure to the file architecture.json?",
    };

    logger.logGroup();
    const structure = fileSystem.pullStructure(path);

    console.log("\n");
    fileSystem.printStructure(structure);
    console.log("\n");

    if (await prompt.confirm(prompts.save)) {
      fileSystem.copyStructure(structure);
    }

    logger.logGroupEnd();
    exit(0);
  });

program
  .command("push")
  .version(version)
  .description("Push structure to the project")
  .argument(
    "<type>",
    `choose one of the following: ${fileSystem.showAllowedArchitectures()}`
  )
  .option("-v, --verbose", "Print more information")
  .action(async (type) => {
    const logger = new Logger("push");

    logger.logGroup();
    if (!fileSystem.isValid(type)) {
      logger.error(`Invalid type: '${type}'`);
      exit(0);
    }

    const structure = fileSystem.getByPattern(type);
    console.log("\n");
    fileSystem.printStructure(structure);
    console.log("\n");

    if (fileSystem.existCurrentArchitectureFile()) {
      if (!(await prompt.confirm(prompts.alreadyExist))) {
        logger.warn("Operation canceled by the user");
        exit(0);
      }
    }

    logger.alert(`Copy new struct: '${type}' to the file architecture.json`);
    fileSystem.copyStructure(structure);
    logger.logGroupEnd();
    exit(0);
  });

program
  .command("generate")
  .version(version)
  .description("Apply structure from file architecture.json")
  .option("-v, --verbose", "Print more information")
  .action(async () => {
    const logger = new Logger("generate");
    logger.logGroup();
    if (!fileSystem.existCurrentArchitectureFile()) {
      logger.error(
        "No structure found in the repository, please run 'architect <push or pull>' first"
      );
      exit(0);
    }
    const structure = fileSystem.readCurrentFileStructure();
    logger.warn("The new Structure will be:");
    console.log("\n");
    fileSystem.printStructure(structure);
    console.log("\n");

    if (await prompt.confirm(prompts.generate)) {
      logger.alert("Generating structure folders to the repository...");
      fileSystem.generateStructure(structure);
    }

    logger.logGroupEnd();
    exit(0);
  });

program
  .command("print")
  .version(version)
  .option("-v, --verbose", "Print more information")
  .description("Print current structure file architecture.json")
  .action(async () => {
    const logger = new Logger("print");
    logger.logGroup();
    if (!fileSystem.existCurrentArchitectureFile()) {
      logger.error(
        "No structure found in the repository, please run 'architect <push or pull>' first"
      );
      exit(0);
    }
    const structure = fileSystem.readCurrentFileStructure();
    console.log("\n");
    fileSystem.printStructure(structure);
    console.log("\n");
    logger.logGroupEnd();
    exit(0);
  });

program
  .command("init")
  .argument("<type>", "", String, "typescript")
  .option("-v, --verbose", "Print more information")
  .version(version)
  .description("Setup all dependencies for backend TypeScript project")
  .action(async (type) => {
    const logger = new Logger(`init ${type}`);
    const alloweds = ["typescript", "ts"];
    if (!alloweds.includes(type)) {
      logger.error(`Invalid type: '${type}' allowed types: ${alloweds}`);
      exit(0);
    }

    logger.logGroup();
    if (await prompt.confirm(prompts.tsInstall(installers.libs.ts))) {
      logger.alert("Init Installer...");
      await installers.typescript();
    }
    if (await prompt.confirm(prompts.eslintInstall)) {
      await installers.eslint();
    }
    if (await prompt.confirm(prompts.prettierInstall)) {
      await installers.prettier();
    }
    logger.logGroupEnd();
    exit(0);
  });

program.parse();
