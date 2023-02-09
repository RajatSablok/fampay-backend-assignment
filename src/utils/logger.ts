import path from 'path';

import winston from 'winston';

import { getLocalStringIST } from './dateHelpers';

const getDefaultLabelName = () => process.env.SERVICE_NAME || 'unspecified';

const ycLogFormat = winston.format.printf(({ level, message, timestamp }) => {
	return `[${timestamp}][${level}]] ${message}`;
});

let ycLogger: winston.Logger | null = null;

const ycLogLevels = {
	levels: {
		critical: 0,
		error: 1,
		info: 2,
		debug: 3,
	},
};

const sanitizeMessage = (message: string) => {
	const indentedMessage = message.replace(/\r?\n|\r/g, ' ');
	return indentedMessage.trim();
};

const getDefaultLogLevel = () => {
	const envType = process.env.NODE_ENV;
	if (envType === 'production') return 'info';
	return 'debug';
};

type TInitLoggerOpts = {
	logFile?: string;
	transports?: Array<winston.transport>;
	format?: winston.Logform.Format;
	level?: string;
	label?: string;
};

type TLoggerError = { prefixMsg?: string; error?: Error | string };

export const initLogger = (options: TInitLoggerOpts) => {
	if (ycLogger) return ycLogger;
	ycLogger = winston.createLogger({
		levels: ycLogLevels.levels,
		level: options.level ? options.level : getDefaultLogLevel(),
		format: options.format
			? options.format
			: winston.format.combine(
					winston.format.timestamp({
						format: getLocalStringIST,
					}),
					winston.format.label({ label: options.label ? options.label : getDefaultLabelName() }),
					ycLogFormat,
			  ),
		transports: options.transports
			? options.transports
			: [
					new winston.transports.File({
						filename: options.logFile || path.join(process.cwd(), 'logs', 'all-logs.log'),
						handleExceptions: true,
						maxsize: 5242880, // for every 5 MB, new files are created
						maxFiles: 1, // only a single file is stored
					}),
					new winston.transports.Console({
						format: winston.format.combine(
							winston.format.timestamp({
								format: getLocalStringIST,
							}),
							winston.format.label({ label: options.label ? options.label : getDefaultLabelName() }),
							ycLogFormat,
						),
					}),
			  ],
		exitOnError: false,
	});
	return ycLogger;
};

const withLogger = (callback: (logger: winston.Logger) => void) => {
	if (ycLogger) return callback(ycLogger);
	return callback(initLogger({}));
};

export const logger = {
	log: (level: string, message: string) => {
		withLogger((_logger) => {
			_logger.log(level, sanitizeMessage(message));
		});
	},
	debug: (message: string) => {
		withLogger((_logger) => {
			_logger.log('debug', sanitizeMessage(message));
		});
	},
	info: (message: string | Error) => {
		withLogger((_logger) => {
			if (typeof message === 'string') {
				_logger.log('info', sanitizeMessage(message));
			} else if (message instanceof Error) {
				_logger.log('info', sanitizeMessage(`\nStacktrace:\n${message.stack}`));
			}
		});
	},
	error: ({ prefixMsg = '', error = '' }: TLoggerError = {}) => {
		let errorString = prefixMsg;

		if (error instanceof Error) {
			errorString += `\nStacktrace:\n${error.stack}`;
		} else {
			errorString += error;
		}
		withLogger((_logger) => {
			_logger.log('error', sanitizeMessage(errorString));
		});
	},
	critical: (message: string) => {
		withLogger((_logger) => {
			_logger.log('critical', sanitizeMessage(message));
		});
	},
};
