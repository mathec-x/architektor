import { Logger } from "#core/logger";
import { Word } from "../word.js";

export class DirEnt {
	/** @type {Array<import("fs").Dirent['name']>} values */
	#values = [];
	/** @type {Word} */
	#words;
	/** @type {Logger} */
	#logger;

	/**
	 * @param {Array<import("fs").Dirent>} values
	 * @param {string | ((name: string) => boolean)} [searchTerm]
	 * @param {'isDirectory' | 'isFile'} dirent
	 */
	constructor(values, searchTerm, dirent = "isDirectory") {
		this.#words = new Word();
		this.#logger = new Logger(DirEnt.name);
		let terms = undefined;
		if (typeof searchTerm === "string") {
			terms = [
				this.#words.plural(this.#words.sanitize(searchTerm)),
				this.#words.singular(this.#words.sanitize(searchTerm))
			];
		}

		this.#values = values
			.filter((entry) => {
				if (entry[dirent]()) {
					if (!searchTerm) {
						return true;
					}

					if (typeof searchTerm === "function") {
						return searchTerm(entry.name);
					}

					const name = this.#words.sanitize(entry.name);
					return terms.some((dir) => name === dir);
				}
				return false;
			})
			.map((entry) => `${entry.parentPath}/${entry.name}`);
	}

	/** @param {(value: { baseName: string }) => void} callback */
	forEach(callback) {
		this.#values.forEach((cur) => {
			const baseName = cur.slice(cur.lastIndexOf("/") + 1, cur.lastIndexOf("."));
			callback({
				baseName
			});
		});
	}

	/** @param {string} str */
	sizeWithout(str) {
		return this.#values.filter(e => e.toLowerCase().indexOf(str) === -1).length;
	}

	/** @param {string} str */
	contains(str) {
		return this.#values.some(f => f.toLowerCase().includes(str));
	}

	/** @param {string[]} args */
	getFirstPath(...args) {
		for (const str of args) {
			const path = this.#values.find(f => f.toLowerCase().includes(str));
			if (path) {
				return {
					name: str,
					path
				};
			}
		}
		return {};
	}

	size() {
		return this.#values.length;
	}

	all() {
		return this.#values;
	}

	first() {
		return this.#values[0];
	}

	analizeFileNotation() {
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

		this.forEach(({ baseName }) => {
			const [actionName, moduleName] = baseName.split(".");

			if (moduleName && moduleName.indexOf("spec") !== -1) {
				acc.testNotation.spec++;
			} else if (moduleName && moduleName.indexOf("test") !== -1) {
				acc.testNotation.test++;
			} else if (this.#words.isKebabCase(actionName || moduleName)) {
				acc.fileNotation.kebabCase++;
			} else if (this.#words.isCamelCase(actionName || moduleName)) {
				acc.fileNotation.camelCase++;
			} else if (this.#words.isPascalCase(actionName || moduleName)) {
				acc.fileNotation.pascalCase++;
			}

			this.#logger.verbose(`Analising file name: ${baseName}`);
		});

		return acc;
	}
}