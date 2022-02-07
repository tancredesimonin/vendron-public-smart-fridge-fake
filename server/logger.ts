/* eslint-disable no-console */
/* eslint-disable import/first */
import chalk from 'chalk';

/**
 * Severity levels for log entries
 *
 */
export declare type LogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'success'
  | 'debug'
  | 'disabled';

const style = {
  title: {
    primary: chalk.bold.magenta,
    secondary: chalk.bold.cyan,
    info: chalk.bold.blue,
    success: chalk.bold.green,
    warn: chalk.bold.yellow,
    error: chalk.bold.red,
    body: chalk.bold.white,
  },
  text: {
    primary: chalk.magenta,
    secondary: chalk.cyan,
    info: chalk.blue,
    success: chalk.green,
    warn: chalk.yellow,
    error: chalk.red,
    body: chalk.white,
  },
};
export const divider =
  '_____________________________________________________________________________________________';
export const space = `
`;

/**
 * Interface for objects where objects in this package's logs can be sent (can be used as `logger` option).
 */
export interface LoggerI {
  name: string;
  logTimestamp: boolean;
  slackWebhook?: string;
  /**
   * Output debug message
   *
   * @param msg any data to log
   *
   */
  debug(...msg: unknown[]): void;

  /**
   * Output info message
   *
   * @param msg any data to log
   */
  info(...msg: unknown[]): void;

  /**
   * Output success message
   * Considered same gravity level as info
   * @param msg any data to log
   */
  success(...msg: unknown[]): void;

  /**
   * Output warn message
   *
   * @param msg any data to log
   */
  warn(...msg: unknown[]): void;

  /**
   * Output error message
   *
   * @param msg any data to log
   */
  error(...msg: unknown[]): void;

  /**
   * This disables all logging below the given level
   *
   * @param {LogLevel} level as a string, like 'error' (case-insensitive)
   * @example
   * log.setLevel("warn")
   * log.warn("warn messages are logged")
   * log.error("error messages are logged")
   * log.info("info messages are not logged")
   */
  setLevel(level: string): void;

  /**
   * This allows the instance to be named so that they can easily be filtered when many loggers are sending output
   * to the same destination.
   *
   * @param {string} name name of the logger instance
   */
  setName(name: string): void;

  msg?: {
    primary: (...msg: unknown[]) => void;
    secondary: (...msg: unknown[]) => void;
    success: (...msg: unknown[]) => void;
    warn: (...msg: unknown[]) => void;
    error: (...msg: unknown[]) => void;
    info: (...msg: unknown[]) => void;
    body: (...msg: unknown[]) => void;
    divider: () => void;
    brand: () => void;
    space: () => void;
  };
}

export interface ConsoleloggerOptions {
  name?: string;
  level?: LogLevel;
  logTimestamp?: boolean;
}

/**
 * Default logger which logs to stdout and stderr
 *
 */
export class Logger implements LoggerI {
  private level: LogLevel;

  private severity: number;

  public name: string;

  public slackWebhook?: string;

  public logTimestamp: boolean;

  constructor({
    name = '',
    level = 'info',
    logTimestamp = true,
  }: ConsoleloggerOptions = {}) {
    this.level = level;
    this.name = name;
    this.logTimestamp = logTimestamp;
    this.severity = 200;
    this.setLevel(this.level);
  }

  /**
   * Sets the instance's log level so that only messages which are equal or more severe are output to the console.
   */
  public setLevel(level: LogLevel): void {
    this.level = level;
    this.setSeverity(this.level);
  }

  private setSeverity(level: LogLevel): void {
    if (level === 'debug') {
      this.severity = 100;
    } else if (level === 'info') {
      this.severity = 200;
    } else if (level === 'warn' || level === 'success') {
      this.severity = 300;
    } else if (level === 'error') {
      this.severity = 400;
    } else if (level === 'disabled') {
      this.severity = 900;
    }
  }

  /**
   * Set the instance's name, which will appear on each log line before the message.
   */
  public setName(name: string): void {
    this.name = name;
  }

  /**
   * Log a debug message
   */
  public debug(...msg: any[]): void {
    if (this.isMoreOrEqualSevere(100)) {
      console.debug(
        style.title.body(this.timestampIt(), `[debug]   [${this.name}] `),
        ...msg
      );
    }
  }

  /**
   * Log an info message
   */
  public info(...msg: any[]): void {
    if (this.isMoreOrEqualSevere(200)) {
      console.info(
        style.title.info(this.timestampIt(), `[info]    [${this.name}] `),
        style.text.info(...msg)
      );
    }
  }

  /**
   * Log an success message
   */
  public success(...msg: any[]): void {
    if (this.isMoreOrEqualSevere(300)) {
      console.info(
        style.title.success(this.timestampIt(), `[success] [${this.name}] `),
        style.text.success(...msg)
      );
    }
  }

  /**
   * Log a warning message
   */
  public warn(...msg: any[]): void {
    if (this.isMoreOrEqualSevere(300)) {
      console.warn(
        style.title.warn(this.timestampIt(), `[warn]    [${this.name}] `),
        style.text.warn(...msg)
      );
    }
  }

  /**
   * Log an error message
   */
  public error(...msg: any[]): void {
    if (this.isMoreOrEqualSevere(400)) {
      console.error(
        style.title.error(this.timestampIt(), `[error]   [${this.name}] `),
        style.text.error(...msg)
      );
    }
  }

  /**
   * Helper to compare two log levels and determine if a is equal or more severe than b
   */
  private isMoreOrEqualSevere(a: number): boolean {
    return a >= this.severity;
  }

  private timestampIt(): string {
    let res = '';
    if (this.logTimestamp) {
      const ts = new Date(Date.now()).toString();
      res = ts.slice(0, ts.length - 14);
    }
    return res;
  }
}
