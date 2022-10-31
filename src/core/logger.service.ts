import log4js, { Logger } from "log4js";
import path from "path";
import { StaticEnvironment } from "./environment.static";

interface ILoggerService {
    error(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;

    log(message?: any, ...optionalParams: any[]): void;
}

class LoggerService implements ILoggerService {

    private _logger: Logger = {} as any;

    constructor() {}

    public initialize(): void {
        log4js.configure({
            appenders: {
                console: {
                    type: "console"
                },
                file: {
                    type: "dateFile",
                    filename: path.join(StaticEnvironment.logsFolder,"masa_backend.log"),
                    keepFileExt: true,
                    numBackups: 7,
                    compress: true
                },
                logLevelConsole: {
                    type: "logLevelFilter",
                    level: "info",
                    appender: "console"
                },
                logLevelFile: {
                    type: "logLevelFilter",
                    level: "debug",
                    appender: "file"
                }
            },
            categories: {
                default: {
                    appenders: ["logLevelConsole", "logLevelFile"],
                    level: "all"
                }
            }
        });

        this._logger = log4js.getLogger("");
    }

    public error(message?: any, ...optionalParams: any[]): void {
        this._logger.error(message,  ...optionalParams);
    }

    public warn(message?: any, ...optionalParams: any[]): void {
        this._logger.warn(message, ...optionalParams);
    }

    public info(message?: any, ...optionalParams: any[]): void {
        this._logger.info(message,  ...optionalParams);
    }

    public debug(message?: any, ...optionalParams: any[]): void {
        this._logger.debug(message,  ...optionalParams);
    }

    public log(message?: any, ...optionalParams: any[]): void {
        this._logger.log(message,  ...optionalParams);
    }
}

export default new LoggerService();