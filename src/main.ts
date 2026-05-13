import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createCorsOptions } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(createCorsOptions());
  
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,   // ✅ IMPORTANT
  }),
);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
