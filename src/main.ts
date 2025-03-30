import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from './metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger setup
  await SwaggerModule.loadPluginMetadata(metadata);
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('NEstJS Technical Test API')
      .setDescription(
        'To get a token for private routes, use the /auth/login or /auth/register endpoint.',
      )
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        description:
          'JWT token. To get a token, use the /auth/login or /auth/register endpoint.',
      })
      .build(),
  );
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT') ?? 3000);
}

bootstrap().catch(console.error);
