import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as config from 'config';
import { AppModule } from './app.module';
import { logger } from './shared/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerDocsConfig = new DocumentBuilder()
    .setTitle(`${config.get<string>('name')} API docs`)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerDocsConfig);
  const swaggerPath = config.get<string>('swagger.path') || '/docs';
  SwaggerModule.setup(swaggerPath, app, document);
  const port = config.get<number>('port') || 3000;
  await app.listen(port);
  logger.info(`App start on ${port}`);
  logger.info(`Swagger docs is ready on ${swaggerPath}`);
}
bootstrap();
