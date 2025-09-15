import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { HttpResponseInterceptor } from './common/interceptors/http-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: parseInt(configService.get<string>('RATE_LIMIT_TTL', '60'), 10),
          limit: parseInt(
            configService.get<string>('RATE_LIMIT_REQUESTS', '100'),
            10,
          ),
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS', 'postgres'),
        database: configService.get<string>(
          'DB_NAME',
          'personal_expense_tracker',
        ),
        autoLoadEntities: true,
        synchronize: true, // Note: set to false in production
        logging: true,
      }),
    }),
    HealthModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    TransactionsModule,
  ],
  providers: [
    {
      provide: 'APP_PIPE',
      useFactory: () =>
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: HttpResponseInterceptor,
    },
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
