import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20; // Set your desired limit

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('transcendence')
    .setDescription('The transcendence API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: `http://${process.env.HOST}:${process.env.FE_PORT}`,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
