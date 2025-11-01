#!/usr/bin/env node

import { prompts, settings } from "#core/constants";
import { Executors } from "#core/executors";
import { Word } from "#core/word";
import { FileManager } from "#core/fileManager";
import { FileSystem } from "#core/fileSystem";
import { Installers } from "#core/installers";
import { Logger } from "#core/logger";
import { Prompt } from "#core/prompt";
import { Command } from "commander";
import { argv, exit } from "process";

const name = "ts-node-app";
const version = "0.0.1";

const fileManager = new FileManager();
const prompt = new Prompt();
const words = new Word();
const fileSystem = new FileSystem(fileManager);
const installers = new Installers(fileManager, prompt);
const executors = new Executors(fileManager, installers, prompt, words);
const program = new Command(name);

if (argv.includes("-v") || argv.includes("--verbose")) {
  console.clear();
  console.log("console was cleared");
}

program
  .command("pull")
  .version(version)
  .description(
    "Generate 'architecture.json' file by path argument and save it in the root of the project" +
    "\nyou can ignore some files or directories by comma separated and regex patterns ex: package?,node_modules"
  )
  .argument("<path>", "Path to the project root directory ex: ./src or ./")
  .option("-v, --verbose", "Print more information")
  .option("-i, --ignore <any>", "Ignore some files or directories by comma separated")
  .action(async (path, options) => {
    options.ignore = (options.ignore ? options.ignore.split(",") : []).concat(["node_modules", "coverage", "dist"]);
    const logger = new Logger("pull");
    logger.logGroup();

    const structure = fileSystem.pullStructure(path, options.ignore);

    console.log("\n");
    fileSystem.printStructure(structure);
    console.log("\n");

    if (await prompt.confirm(prompts.saveStructureToFile)) {
      fileSystem.copyStructure(structure);
    }

    logger.logGroupEnd();
    exit(0);
  });

program
  .command("push")
  .version(version)
  .description("Push structure to the project")
  .option("-v, --verbose", "Print more information")
  .argument("[type]", `choose one of the following: ${fileSystem.showAllowedArchitectures()}`)
  .action(async (type) => {
    const logger = new Logger("push");
    logger.logGroup();
    if (type?.length > 2) {
      type = fileSystem.allowedArchitectures.find((e) => e.toLowerCase().startsWith(type.toLowerCase()));
    }

    if (!type) {
      type = await prompt.select("Which architecture do you want to use?", fileSystem.allowedArchitectures);
      if (!type) {
        logger.warn("No type selected");
        exit(0);
      }
    }

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

    logger.alert(`Copy new struct: '${type}' to the file architecture.json, run 'ts-node-app generate' to apply it`);
    fileSystem.copyStructure(structure);

    if (await prompt.confirm(prompts.generate)) {
      logger.alert("Generating structure folders to the repository...");
      fileSystem.generateStructure(structure);
      logger.printUsageHints();
    }

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
      logger.error("No structure found in the repository, please run 'ts-node-app <push or pull>' first");
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
      logger.printUsageHints();
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
      logger.error("No structure found in the repository, please run 'ts-node-app <push or pull>' first");
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
  .version(version)
  .command("add")
  .argument("[framework]", "Framework to add to the project")
  .argument("[filename]", "filename to create", String)
  .description("Add a framework to the project")
  .option("-v, --verbose", "Print more information")
  .action(async (framework, filename) => {
    await executors.add(framework, filename);
    exit(0);
  });

program
  .command("init")
  .argument("[type]", "", String, "typescript")
  .option("-y, --yes-to-all", "Answer yes to all questions")
  .option("-v, --verbose", "Print more information")
  .version(version)
  .description("Setup all dependencies for backend TypeScript project")
  .action(async (type, options) => {
    if (options.yesToAll) {
      prompt.yesToAll = true;
    }

    const logger = new Logger(`init ${type}`);
    logger.logGroup();
    if (!settings.initAllowedTypes.includes(type)) {
      logger.error(`Invalid type: '${type}' allowed types: ${settings.initAllowedTypes}`);
      exit(0);
    }

    await executors.init();

    const choice = await prompt.select(
      "Which architecture do you want to use? (you can cancel and run 'ts-node-app push' later)",
      fileSystem.allowedArchitectures
    );

    if (choice) {
      if (!fileSystem.isValid(choice)) {
        logger.error(`Invalid struct: '${choice}'`);
        exit(0);
      }

      const structure = fileSystem.getByPattern(choice);

      console.log();
      await prompt.delay(355);
      fileSystem.printStructure(structure);
      console.log();

      if (fileSystem.existCurrentArchitectureFile() && !(await prompt.confirm(prompts.alreadyExist))) {
        logger.warn("Operation canceled by the user");
        exit(0);
      }

      await prompt.delay(355);
      fileSystem.copyStructure(structure);

      if (await prompt.confirm(prompts.generate)) {
        logger.warn("Generating structure folders to the repository...");

        await prompt.delay(355);
        fileSystem.generateStructure(structure);
      }

      const framework = await prompt.select("Do you want to apply one of these?", ["Express"], { cancelLabel: "No" });
      if (framework) {
        await executors.add(framework);
      }

      const entry = fileSystem.getStarterEntry(structure);
      prompt.code(entry);

      logger.alert("Run 'npm run dev' to start the project");
    }

    logger.alert("Finished");
    logger.logGroupEnd();
    exit(0);
  });

program.parse();
