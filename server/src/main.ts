import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(parseInt(process.env.PORT));
  logger.log(`Payment server listening on port ${process.env.PORT}`);
}
bootstrap();
