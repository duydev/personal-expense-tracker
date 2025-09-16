import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ShutdownSignal } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const isDev = process.env.NODE_ENV === 'development';
  const whitelist = process.env.WHITELISTED_DOMAINS?.split(',') || [];
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.use(helmet());
  app.use(compression());

  if (!isDev) {
    app.enableCors({
      origin: whitelist,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
  }

  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME ?? 'Personal Expense Tracker API')
    .setDescription(
      process.env.APP_DESCRIPTION ??
        'The Personal Expense Tracker API description',
    )
    .setVersion(process.env.APP_VERSION ?? '1.0')
    .addTag('expenses')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // gracefully shutdown
  app.enableShutdownHooks([ShutdownSignal.SIGTERM, ShutdownSignal.SIGINT]);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  logger.log(`Environment: ${process.env.NODE_ENV}`);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Swagger is running on: ${await app.getUrl()}/api`);
}

bootstrap();
