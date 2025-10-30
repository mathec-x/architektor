export class Word {

	/** @param {string} word */
	isKebabCase(word) {
		return /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/.test(word);
	}

	/** 
	 * @param {string[]} word 
	 * @description replace uppercase spaces or underscores with dashes and lowercase the word
	 */
	kebabCase(...word) {
		return word
			.map((w, i) => {
				const next = word[i + 1]?.replace(/-/gi, "") || null;
				const regex = next ? new RegExp(next, "gi") : "";
				return w
					.replace(regex, "")
					.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
					.replace(/[_\s]+/g, "-")
					.toLowerCase();
			}
			).join(".");
	}

	/** @param {string} word */
	isPascalCase(word) {
		return /^[A-Z][a-zA-Z0-9]*$/.test(word);
	}

	/** @param {string[]} word */
	pascalCase(...word) {
		return word
			.map(w =>
				w.replace(/[-_/\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
					.replace(/^(.)/, (c) => c.toUpperCase())
			).join("");
	}

	/** @param {string} word */
	isCamelCase(word) {
		return /^[a-z]+([A-Z][a-z0-9]*)*$/.test(word);
	}

	/** @param {string[]} word */
	camelCase(...word) {
		return word.map(w =>
			w.replace(/[-_/\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
				.replace(/^(.)/, (c) => c.toLowerCase())
		).join("");
	}

	/** @param {string} word */
	ucFirst(word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}

	/** @param {string} word*/
	sanitize(word) {
		return word.toLowerCase().replace(/[^a-zA-Z/\\]/g, "");
	}

	/** @param {string} word */
	plural(word) {
		const lastChar = word.slice(-1);
		if (lastChar === "y") {
			return word.slice(0, -1) + "ies";
		} else if (lastChar === "s") {
			return word;
		} else if (lastChar === "h") {
			return word + "es";
		}
		return word + "s";
	}

	/** @param {string} word */
	singular(word) {
		const lastChar = word.slice(-1);
		if (lastChar === "s") {
			if (word.slice(-3) === "ies") {
				return word.slice(0, -3) + "y";
			} else if (word.slice(-2) === "es") {
				return word.slice(0, -2);
			} else {
				return word.slice(0, -1);
			}
		}
		return word;
	}

	/**
	 * @param {string} word 
	 * @param {string} [excludeWord]
	 */
	splitCamelCaseOrNonCharacters(word, excludeWord = "") {
		const pl = this.plural(excludeWord);
		const si = this.singular(excludeWord);
		const uc = this.camelCase(excludeWord);
		const regex = new RegExp([pl, si, uc].join("|"), "gi");
		return word
			.replace(regex, "")
			.split(/(?=[A-Z])|[^a-zA-Z0-9]+/)
			.filter(Boolean)
			.map((w) => w.toLowerCase());
	}
}