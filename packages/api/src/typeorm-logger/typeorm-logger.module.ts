import { Module } from '@nestjs/common';
import { TypeOrmPinoLogger } from './typeorm-pino.logger';

@Module({
  providers: [TypeOrmPinoLogger],
  exports: [TypeOrmPinoLogger],
})
export class TypeOrmLoggerModule {}
