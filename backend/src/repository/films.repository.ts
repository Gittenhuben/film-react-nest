import { Injectable, Inject } from '@nestjs/common';
import mongoose, { Schema } from 'mongoose';

import { FilmsDatabaseDto, ScheduleDatabaseDto, IFilmDatabase, ISessionDatabase } from '../films/dto/films.dto';
import { TakenDto, ISeatsToTakeOnSession } from '../order/dto/order.dto';
import { AppConfig } from '../app.config.provider';

export interface FilmsRepository {
  findAllFilms: () => Promise<FilmsDatabaseDto>;
}

const scheduleSchema = new Schema<ISessionDatabase>({
  id: { type: String, required: true },
  daytime: { type: String, required: true },
  hall: { type: Number, required: true },
  rows: { type: Number, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  taken: { type: [String], required: true }
});

const filmSchema = new Schema<IFilmDatabase>({
  id: { type: String, required: true },
  rating: { type: Number, required: true },
  director: { type: String, required: true },
  tags: [{ type: String, required: true }],
  title: { type: String, required: true },
  about: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  cover: { type: String, required: true },
  schedule: { type: [scheduleSchema], required: true }
});

@Injectable()
export class DatabaseConnection {
  private url: string;
  public connection: mongoose.Connection;

  constructor(@Inject('CONFIG') config: AppConfig) {
    this.url = config.database.url;
    this.connection = mongoose.createConnection(this.url);
  }
}

@Injectable()
export class FilmsMongoDbRepository implements FilmsRepository {
  private filmModel: mongoose.Model<IFilmDatabase>;

  constructor(private databaseConnection: DatabaseConnection) {
    this.filmModel = this.databaseConnection.connection.model('film', filmSchema);
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

  async findScheduleByFilmId(id: string): Promise<ScheduleDatabaseDto> {
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

  async updatePlaces(seatsToTakeOnSession: ISeatsToTakeOnSession) {
    return this.filmModel.findOneAndUpdate(
      { 'schedule.id': seatsToTakeOnSession.sessionId },
      { $addToSet: { 'schedule.$.taken': seatsToTakeOnSession.seatsToTake } },
      { runValidators: true, new: true }
    );
  }
}
