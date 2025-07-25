import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RolesGuard } from './guards/roles/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth-guard/jwt-auth-guard.guard';
import * as bodyParser from 'body-parser';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
  const app = await NestFactory.create(AppModule);

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  const origins = allowedOrigins.map((origin) => origin.trim()) || [];

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  app.useGlobalGuards(
    new JwtAuthGuard(app.get(Reflector)),
    new RolesGuard(app.get(Reflector)),
  );

  app.useGlobalPipes(new I18nValidationPipe());

  app.useGlobalFilters(new I18nValidationExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Pro Meet API')
    .setDescription('API documentation for Pro Meet application')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});
