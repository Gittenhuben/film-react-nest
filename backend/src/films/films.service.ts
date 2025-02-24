import { Injectable } from '@nestjs/common';

import { FilmsMongoDbRepository } from '../repository/films.repository';
import { FilmsResponseDto, ScheduleResponseDto, ISession } from '../films/dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsMongoDbRepository) {}

  async getAll(): Promise<FilmsResponseDto> {
    const filmsDatabaseDto = await this.filmsRepository.findAllFilms();
    return {
      items: filmsDatabaseDto.films,
      total: filmsDatabaseDto.films.length
    };
  }

  async getScheduleByFilmId(id: string): Promise<ScheduleResponseDto> {
    const sessionDatabaseDto = await this.filmsRepository.findScheduleByFilmId(id);

    return {
      items: sessionDatabaseDto.schedule.map(session => {
        const sessionResponse: ISession = {
          id: session.id,
          daytime: session.daytime,
          hall: session.hall.toString(),
          rows: session.rows,
          seats: session.seats,
          price: session.price,
          taken: session.taken
        };

        return sessionResponse;
      }),
      total: sessionDatabaseDto.schedule.length
    };
  }
}
