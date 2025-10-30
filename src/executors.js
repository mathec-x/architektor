import { exit } from "process";
import { prompts } from "./constants.js";
import { Logger, styled } from "./logger.js";

export class Executors {
	/**
	 * @param {FileManager} fileManager
	 * @param {Installers} installers
	 * @param {Prompt} prompt
	 * @param {Words} words
	 */
	constructor(fileManager, installers, prompt, words) {
		this.logger = new Logger(Executors.name);
		this.fileManager = fileManager;
		this.installers = installers;
		this.prompt = prompt;
		this.words = words;
	}

	async init() {
		const nodeVersion = this.prompt.spawn("node", ["--version"]);
		this.logger.alert(`Node version: ${nodeVersion} - Init`);

		if (!this.fileManager.isFile("package.json")) {
			this.logger.info("Init Node project...");

			console.log();
			this.prompt.spawn("npm", this.prompt.install.init(), {
				stdio: "inherit"
			});
		}

		if (await this.prompt.confirm(prompts.tsInstall)) {
			await this.prompt.delay(355);
			await this.installers.typescript(nodeVersion);
		}
		if (await this.prompt.confirm(prompts.eslintInstall)) {
			await this.prompt.delay(355);
			await this.installers.eslint();
		}
		if (await this.prompt.confirm(prompts.defaultConfig)) {
			await this.prompt.delay(355);
			await this.installers.defaultConfig();
			await this.installers.docker();
		}

		this.logger.info("Project initialized successfully!");
	}

	/**
	 * @param {string} framework
	 * @param {string} [filename]
	*/
	async add(framework, filename) {
		console.clear();
		const nodeVersion = this.prompt.spawn("node", ["--version"]);
		this.logger.info(`Node version: ${nodeVersion} - Add`);
		this.logger.verbose(`Preparing [${styled("yellow", framework)}] ${filename || ""}`);

		if (filename) {
			await this.smartCreateFile(framework, filename);
			return;
		}

		switch (framework.toLowerCase()) {
			case "express":
				await this.installers.express();
				break;
			case "typescript":
				await this.installers.typescript(nodeVersion);
				break;
			case "logger":
				await this.installers.loggerService();
				break;
			case "eslint":
				await this.installers.eslint();
				break;
			case "docker":
				await this.installers.docker();
				break;
			default:
				this.logger.error("Invalid framework:", framework);
				break;
		}
	}

	/**
	 * @param {string} moduleName
	 * @param {string} filename
	 * 
	 * @description Smart create a file inside a detected folder structure
	 * npx tsna add service userService
	 */
	async smartCreateFile(moduleName, filename) {
		this.logger.debug(`Scan for a directory matching: '${moduleName}' (${filename})`);
		await this.prompt.delay(655);
		const list = this.fileManager.scandir("src", moduleName);

		const currentFolder = (list.length > 1)
			? await this.prompt.select(`Found these directories matching '${moduleName}', select one to use:`, list)
			: list[0];

		if (!currentFolder) {
			this.logger.warn("No structure found, aborting file creation.");
			exit(0);
		}

		this.logger.info(`Selected directory: ${currentFolder}`);
		const { fileNotation, testNotation } = this.getFileNotationFromDir(currentFolder);
		const { fnName, className } = this.structFromArgs(filename, moduleName);

		// Scan folders inside the currentFolder using ctxName as search term (e.g userService => service) 
		const dirFolders = this.fileManager.scandir(currentFolder);
		const hasTestFolder = dirFolders.some(f => f.toLowerCase().includes(`__${testNotation}`));
		const createDir = (dirFolders.length > 0) ? `${currentFolder}/${fnName}` : currentFolder;

		const fileNameFormatted = {
			kebabCase: this.words.kebabCase(className, moduleName),
			camelCase: this.words.camelCase(className),
			pascalCase: this.words.pascalCase(className)
		};

		const willCreate = {
			dir: createDir,
			main: `${createDir}/${fileNameFormatted[fileNotation]}.ts`,
			spec: `${createDir}/${hasTestFolder ? `__${testNotation}s__/` : ""}${fileNameFormatted[fileNotation]}.${testNotation}.ts`,
		};

		await this.prompt.delay(555);
		this.logger.info(`Will create directory: ${styled("white", willCreate.dir)}`);
		this.logger.info(styled("yellow", "- " + willCreate.main));
		this.logger.info(styled("yellow", "- " + willCreate.spec));

		if (!(await this.prompt.confirm("Proceed?"))) {
			this.logger.info("Aborted by user.");
			exit(0);
		}

		this.fileManager.makeFileIfNotExists(willCreate.main);
		this.fileManager.makeFileIfNotExists(willCreate.spec);
		this.prompt.code(willCreate.main);
		this.logger.debug("Done");
	}

	/**
	 * 
	 * @param {string} filename - full filename (e.g UserExtractService)
	 * @param {string} mdlName - module name (e.g Module, Service, Controller)
	 */
	structFromArgs(filename, mdlName) {
		// Example: add module UserExtractService

		// filename: "UserExtractService"
		const separatedWords = this.words.splitCamelCaseOrNonCharacters(filename, mdlName);
		const [fnName, ...identificators] = separatedWords;

		// ctxName: "ExtractService",
		const ctxName = this.words.pascalCase(identificators.join("-"));

		// User + Extract + Service + Module => UserExtractServiceModule
		const className = this.words.pascalCase(...separatedWords, mdlName);

		// console.log({ filename, mdlName, separatedWords, fnName, ctxName, className }); // --- IGNORE ---
		// fnName: "user", ctxName: "ExtractService", mdlName: "module" => className: "UserExtractServiceModule"
		return {
			fnName,
			ctxName,
			className
		};
	}

	/** 
	 * @param {string} path 
	 * @return {{
	 * 	testNotation?: 'spec' | 'test'; 
	 * 	fileNotation?: 'camelCase' | 'kebabCase' | 'pascalCase'
	 * }}
	*/
	getFileNotationFromDir(path) {
		const dirFiles = this.fileManager.scandir(path, null, "isFile");
		const acc = {
			testNotation: {
				spec: 0,
				test: 0
			},
			fileNotation: {
				camelCase: 0,
				pascalCase: 0,
				kebabCase: 0
			}
		};
		dirFiles.forEach((cur) => {
			const baseName = cur.slice(cur.lastIndexOf("/") + 1, cur.lastIndexOf("."));
			const [actionName, moduleName] = baseName.split(".");

			if (moduleName && moduleName.indexOf("spec") !== -1) {
				acc.testNotation.spec++;
			} else if (moduleName && moduleName.indexOf("test") !== -1) {
				acc.testNotation.test++;
			} else if (this.words.isKebabCase(actionName || moduleName)) {
				acc.fileNotation.kebabCase++;
			} else if (this.words.isCamelCase(actionName || moduleName)) {
				acc.fileNotation.camelCase++;
			} else if (this.words.isPascalCase(actionName || moduleName)) {
				acc.fileNotation.pascalCase++;
			}

			this.logger.verbose(`Analising file name: ${baseName}`);
			return acc;
		}, { testNotation: undefined, fileNotation: undefined });

		this.logger.debug("file notation current", acc);
		return {
			testNotation: (acc.testNotation.spec <= acc.testNotation.test) ? "test" : "spec",
			fileNotation: acc.fileNotation.kebabCase >= acc.fileNotation.camelCase
				? (acc.fileNotation.kebabCase >= acc.fileNotation.pascalCase ? "kebabCase" : "pascalCase")
				: (acc.fileNotation.camelCase >= acc.fileNotation.pascalCase ? "camelCase" : "pascalCase")
		};
	}
}

/**
 * @typedef {import("./fileManager.js").FileManager} FileManager
 * @typedef {import("./prompt.js").Prompt} Prompt
 * @typedef {import("./installers.js").Installers} Installers
 * @typedef {import("./word.js").Word} Words
 */
