import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.APP_ENV === 'production',
    })
  )

  app.use(cookieParser());

  // 1. Configura el título y la descripción de tu API
  const config = new DocumentBuilder()
    .setTitle('Mi API de NestJS')
    .setDescription('Documentación automática de todos los endpoints')
    .setVersion('1.0')
    .addTag('endpoints') // Opcional: para agrupar
    .build();

  // 2. Crea el documento Swagger
  const document = SwaggerModule.createDocument(app, config);

  // 3. Define la ruta donde se desplegará la página
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
