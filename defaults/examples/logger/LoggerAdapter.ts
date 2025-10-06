import { inspect } from 'util';

type LogLevel = 'VERBOSE' | 'DEBUG' | 'INFO' | 'WARN' | 'HTTP' | 'ERROR' | 'CRITICAL' | 'ALERT';

export class LoggerAdapter {
	protected levels = {};
	private COLORS = {
		RESET: '\u001B[0m',
		BLACK: '\u001B[30m',
		RED: '\u001B[31m',
		GREEN: '\u001B[32m',
		YELLOW: '\u001B[33m',
		BLUE: '\u001B[34m',
		MAGENTA: '\u001B[35m',
		CYAN: '\u001B[36m',
		GREY: '\u001B[90m',
		ERROR: '\u001B[91m',
		INFO: '\u001B[92m',
		WARN: '\u001B[93m',
		HTTP: '\u001B[94m',
		DEBUG: '\u001B[95m',
		ALERT: '\u001B[96m',
		WHITE: '\u001B[97m',
	};

	constructor(
		private readonly context: string = process.env.APPLICATION_NAME || 'Application',
		private readonly level: LogLevel = process.env.LOG_LEVEL as LogLevel || 'INFO',
		private readonly json = process.env.LOG_FORMAT === 'json'
	) { }

	protected formatMessage(level: LogLevel, message: string | Error, optionalParams: any[]) {
		const metadata = message instanceof Error ? { stack: message } : {};

		for (const param of optionalParams) {
			if (['string', 'number'].includes(typeof param)) {
				message += ' ' + param;
			} else if (param instanceof Date) {
				message += ' ' + param.toISOString();
			} else if (param instanceof Error) {
				Object.assign(metadata, { Error: param });
			} else {
				Object.assign(metadata, param);
			}
		}

		return {
			message: message,
			level,
			context: this.context,
			metadata
		};
	}

	protected isEnabled(level: LogLevel) {
		const enabledindex = Object.keys(this.levels).indexOf(this.level.toUpperCase());
		if (enabledindex === -1) return false; // If the level is not found, log is silent

		const currentindex = Object.keys(this.levels).indexOf(level.toUpperCase());
		return currentindex >= enabledindex;
	}

	protected doprint(data: ReturnType<typeof this.formatMessage>) {
		if (this.json) {
			console.log(JSON.stringify(data));
		} else {
			const { level, message, metadata } = data;
			const $color = this.levels[level];
			const date = new Intl.DateTimeFormat('UTC', {
				year: 'numeric', month: '2-digit', day: '2-digit',
				hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
			}).format(new Date());

			let formatMessage = `<grey>(${process.env.APPLICATION_NAME}/${process.env.NODE_ENV}) ${process.pid} - `;
			formatMessage += `<reset>${date} `;
			formatMessage += `<${$color}>${level.padStart(7)} `;
			formatMessage += `<yellow>[${this.context}] `;
			formatMessage += `<${$color}>${message} `;

			if (['DEBUG', 'CRITICAL'].includes(level.toUpperCase()) && Object.keys(metadata).length) {
				formatMessage += inspect(metadata, { colors: true, depth: 5, maxStringLength: 75 });
			}

			this.colorfully(formatMessage);
		}
	}

	/**
	 * @description
	 * print full color text
	 * @example 
	 * this.colorfully(`<MAGENTA>import <CYAN>knex <MAGENTA>from <YELLOW>'knex'`)
	 */
	colorfully(text: string) {
		for (const key in this.COLORS) {
			const regexp = new RegExp('<' + key + '>', 'gmi');
			text = text.replace(regexp, this.COLORS[key.toUpperCase()]);
		}
		text = text.replace(/({|})/g, this.COLORS.WHITE + '$1' + this.COLORS.RESET);
		console.log(text, this.COLORS.RESET);
	}
}