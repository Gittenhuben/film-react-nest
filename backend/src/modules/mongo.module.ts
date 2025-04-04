import { Module } from '@nestjs/common';

import { configProvider } from '../app.config.provider';
import { FilmsController } from '../films/films.controller';
import { OrderController } from '../order/order.controller';
import { FilmsService } from '../films/films.service';
import { OrderService } from '../order/order.service';
import { FilmsRepositoryMongoDb, DatabaseConnectionMongoDb } from '../repository/films.repository.mongo';

@Module({
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    FilmsService,
    OrderService,
    {
      provide: 'REPOSITORY',
      useClass: FilmsRepositoryMongoDb
    },
    DatabaseConnectionMongoDb
  ]
})
export class MongoModule {}
