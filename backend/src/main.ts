import { NestFactory } from '@nestjs/core';
import { ValidationPipe, LogLevel } from '@nestjs/common';

import { AppModule } from './app.module';
import { ErrorFilter } from './error.filter';
import { configProvider, AppConfig } from './app.config.provider';
import { DevLogger, JsonLogger, TskvLogger } from './loggers';

async function bootstrap(appConfig: AppConfig) {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalFilters(new ErrorFilter());

  const logLevels = appConfig.log.logLevels as LogLevel[];
  if (appConfig.log.logType === DevLogger.name) app.useLogger(new DevLogger(undefined, { logLevels }));
  else if (appConfig.log.logType === JsonLogger.name) app.useLogger(new JsonLogger(undefined, { logLevels }));
  else if (appConfig.log.logType === TskvLogger.name) app.useLogger(new TskvLogger(undefined, { logLevels }));

  const port = appConfig.port;
  await app.listen(port, () => console.log(`Server Started, Port: ${port}`));
}
bootstrap(configProvider.useValue);
