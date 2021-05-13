import {
  Injectable,
  LoggerService,
  Logger as NestLogger,
} from '@nestjs/common';
import winston, { createLogger, transports, format } from 'winston';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config';
import { LogLevel } from './log.levels';
import { timestamp } from './formats/timestamp';
import * as Transport from 'winston-transport';

@Injectable()
export class Logger extends NestLogger implements LoggerService {
  protected readonly logger: ReturnType<typeof createLogger>;

  public constructor(configuration: ConfigService<Config>) {
    super();

    this.logger = this.createLogger(configuration);
  }

  public debug(message: any, context?: string): any {
    this.logger.debug({ message, context });
  }

  public error(message: any, trace?: string, context?: string): any {
    this.logger.error({ message, context });
  }

  public log(message: any, context?: string): any {
    this.logger.log({ message, level: LogLevel.INFO, context });
  }

  public verbose(message: any, context?: string): any {
    this.logger.verbose({ message, context });
  }

  public warn(message: any, context?: string): any {
    this.logger.warn({ message, context });
  }

  protected createLogger(configuration: ConfigService<Config>): winston.Logger {
    return createLogger({
      level: configuration.get<string>('LOG_LEVEL', LogLevel.INFO),
      transports: this.createTransports(),
      format: this.createLogFormat(),
    });
  }

  protected createTransports(): Transport[] {
    return [new transports.Console()];
  }

  protected createLogFormat(): winston.Logform.Format {
    return format.combine(
      timestamp,
      format.printf(({ context, message, timestamp }) => {
        if (this.context || context) {
          return `${timestamp}: [${context || this.context}] ${message}`;
        }

        return `${timestamp}: ${message}`;
      }),
    );
  }
}
