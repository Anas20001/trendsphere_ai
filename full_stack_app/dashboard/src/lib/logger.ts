type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private isDevelopment = import.meta.env.DEV;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? ` | Context: ${JSON.stringify(options.context)}` : '';
    const errorStack = options?.error?.stack ? `\n${options.error.stack}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${context}${errorStack}`;
  }

  info(message: string, options?: LogOptions): void {
    const formattedMessage = this.formatMessage('info', message, options);
    console.log(formattedMessage);
  }

  warn(message: string, options?: LogOptions): void {
    const formattedMessage = this.formatMessage('warn', message, options);
    console.warn(formattedMessage);
  }

  error(message: string, options?: LogOptions): void {
    const formattedMessage = this.formatMessage('error', message, options);
    console.error(formattedMessage);
  }

  debug(message: string, options?: LogOptions): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage('debug', message, options);
      console.debug(formattedMessage);
    }
  }
}

export const logger = Logger.getInstance();