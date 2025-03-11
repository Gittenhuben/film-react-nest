import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { PostgresModule } from './modules/postgres.module';
import { MongoModule } from './modules/mongo.module';

const POSTGRES_DRIVER_NAME = 'postgres';
const MONGODB_DRIVER_NAME = 'mongodb';
class Mock {}

@Module({
  imports: [
    ConfigModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public')
    }),
    configProvider.useValue.database.driver === MONGODB_DRIVER_NAME ? MongoModule : Mock,
    configProvider.useValue.database.driver === POSTGRES_DRIVER_NAME ? PostgresModule : Mock
  ]
})
export class AppModule {}
