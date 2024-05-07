import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const port = 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "*" });
  app.use(express.static("."));
  app.useGlobalPipes(new ValidationPipe());     // validation


  const config = new DocumentBuilder().setTitle("HOKKAIDO_VIETNAM").setVersion("1.1.3").addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);


  await app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/swagger`)
  });


}
bootstrap();
