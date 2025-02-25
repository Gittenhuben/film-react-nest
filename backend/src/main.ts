import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ErrorFilter } from './error.filter';
import { configProvider, AppConfig } from './app.config.provider';

async function bootstrap(appConfig: AppConfig) {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn']
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalFilters(new ErrorFilter());
  const port = appConfig.port;
  await app.listen(port, () => console.log(`Server Started, Port: ${port}`));
}
bootstrap(configProvider.useValue);
