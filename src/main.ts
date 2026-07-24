import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createCorsOptions } from './config/cors.config';
import * as bodyParser from 'body-parser';
import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors(createCorsOptions());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,   // ✅ IMPORTANT
      transformOptions: {
        enableImplicitConversion: true, // Aide NestJS à convertir les types
      },
    }),
  );

  app.use(bodyParser.urlencoded({ extended: true }));

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();