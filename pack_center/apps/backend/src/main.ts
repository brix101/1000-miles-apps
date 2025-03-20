import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigSchemaType } from './common/config.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
    bufferLogs: true,
  });
  const config = app.get(ConfigService<ConfigSchemaType>);
  const port = config.get('PORT');
  const origins = config.get('ORIGINS');

  // app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  app.use('/api/v1/static', express.static(join(process.cwd(), 'public')));
  app.use('/api/v1/uploads', express.static(join(process.cwd(), 'uploads')));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    origin: origins,
    credentials: true,
  });
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );
  await app.listen(port);
}
bootstrap();
