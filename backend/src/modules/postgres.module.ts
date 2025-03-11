import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configProvider } from '../app.config.provider';
import { FilmsController } from '../films/films.controller';
import { OrderController } from '../order/order.controller';
import { FilmsService } from '../films/films.service';
import { OrderService } from '../order/order.service';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsRepositoryPostgres } from '../repository/films.repository.postgres';
import { FilmEntity } from '../repository/entities/film.entity';
import { ScheduleEntity } from '../repository/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configProvider.useValue.database.host,
      port: configProvider.useValue.database.port,
      username: configProvider.useValue.database.username,
      password: configProvider.useValue.database.password,
      database: configProvider.useValue.database.database,
      entities: [FilmEntity, ScheduleEntity],
      synchronize: false
    }),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    FilmsService,
    OrderService,
    {
      provide: FilmsRepository,
      useClass: FilmsRepositoryPostgres
    }
  ]
})
export class PostgresModule {}
