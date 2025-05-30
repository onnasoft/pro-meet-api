import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
  const app = await NestFactory.create(AppModule);

  const origins = allowedOrigins.map((origin) => origin.trim()) || [];

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});
