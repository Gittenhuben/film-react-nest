import { Injectable, Inject } from '@nestjs/common';
import mongoose from 'mongoose';

import { FilmsDatabaseDto, ScheduleDatabaseDto, IFilmDatabase } from '../films/dto/films.dto';
import { TakenDto, ISeatsToTakeOnSession } from '../order/dto/order.dto';
import { AppConfig } from '../app.config.provider';
import { FilmsRepository } from './films.repository';
import { filmSchema } from './schemas/film.schema';

@Injectable()
export class DatabaseConnectionMongoDb {
  private url: string;
  public connection: mongoose.Connection;

  constructor(@Inject('CONFIG') config: AppConfig) {
    this.url = config.database.url;
    this.connection = mongoose.createConnection(this.url);
  }
}

@Injectable()
export class FilmsRepositoryMongoDb implements FilmsRepository {
  private filmModel: mongoose.Model<IFilmDatabase>;

  constructor(private databaseConnection: DatabaseConnectionMongoDb) {
    this.filmModel = this.databaseConnection.connection.model('film', filmSchema);
    console.log('DBMS: MongoDb');
  }

  async findAllFilms(): Promise<FilmsDatabaseDto> {
    return {
      films: await this.filmModel.find(
        {},
        {
          _id: 0,
          id: 1,
          rating: 1,
          director: 1,
          tags: 1,
          title: 1,
          about: 1,
          description: 1,
          image: 1,
          cover: 1
        }
      )
    };
  }

  async findSchedulesByFilmId(id: string): Promise<ScheduleDatabaseDto> {
    return this.filmModel.findOne(
      { id },
      {
        'schedule.id': 1,
        'schedule.daytime': 1,
        'schedule.hall': 1,
        'schedule.rows': 1,
        'schedule.seats': 1,
        'schedule.price': 1,
        'schedule.taken': 1
      }
    );
  }

  async findTakenBySessionIds(ids: string[]): Promise<TakenDto> {
    return this.filmModel.aggregate([
      { $match: { 'schedule': { $elemMatch: { 'id': { $in: ids } } } } },
      { $unwind: '$schedule' },
      { $match: { 'schedule.id': { $in: ids } } },
      {
        $project: {
          '_id': 0,
          'filmId': '$id',
          'sessionId': '$schedule.id',
          'taken': '$schedule.taken',
          'rows': '$schedule.rows',
          'seats': '$schedule.seats'
        }
      }
    ]);
  }

  async updatePlaces(seatsToTakeOnSession: ISeatsToTakeOnSession): Promise<void> {
    await this.filmModel.findOneAndUpdate(
      { 'schedule.id': seatsToTakeOnSession.sessionId },
      { $addToSet: { 'schedule.$.taken': seatsToTakeOnSession.seatsToTake } },
      { runValidators: true, new: true }
    );
  }
}
