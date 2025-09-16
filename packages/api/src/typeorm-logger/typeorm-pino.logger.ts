import { Logger as PinoLogger } from 'nestjs-pino';
import { Logger as TypeOrmLogger } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmPinoLogger implements TypeOrmLogger {
  constructor(private readonly logger: PinoLogger) {}

  logQuery(query: string, parameters?: any[]) {
    this.logger.debug({ query, parameters }, 'TypeORM Query');
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    this.logger.error({ error, query, parameters }, 'TypeORM Query Error');
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn({ time, query, parameters }, 'TypeORM Slow Query');
  }

  logSchemaBuild(message: string) {
    this.logger.log({ message }, 'TypeORM Schema Build');
  }

  logMigration(message: string) {
    this.logger.log({ message }, 'TypeORM Migration');
  }

  log(level: 'log' | 'info' | 'warn', message: string) {
    if (level === 'log' || level === 'info') {
      this.logger.log({ message }, 'TypeORM');
    } else if (level === 'warn') {
      this.logger.warn({ message }, 'TypeORM');
    }
  }
}
