import { Injectable, Optional } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { FilmsDatabaseDto, ScheduleDatabaseDto } from '../films/dto/films.dto';
import { TakenDto, ISeatsToTakeOnSession } from '../order/dto/order.dto';
import { FilmsRepository } from './films.repository';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';

@Injectable()
export class FilmsRepositoryPostgres implements FilmsRepository {
  constructor(
    @Optional() @InjectRepository(FilmEntity) private readonly filmRepository: Repository<FilmEntity>,
    @Optional() @InjectRepository(ScheduleEntity) private readonly scheduleRepository: Repository<ScheduleEntity>
  ) {
    console.log('DBMS: Postgres');
  }

  async findAllFilms(): Promise<FilmsDatabaseDto> {
    const films = await this.filmRepository.find({ order: { id: 'DESC' } });
    return {
      films: films.map(elem => {
        return {
          ...elem,
          tags: Array.isArray(elem.tags) ? elem.tags : elem.tags.split(',')
        };
      })
    };
  }

  async findSchedulesByFilmId(id: string): Promise<ScheduleDatabaseDto> {
    return {
      schedule: await this.scheduleRepository.find({
        where: { filmId: { id } },
        order: { daytime: 'ASC' }
      })
    };
  }

  async findTakenBySessionIds(ids: string[]): Promise<TakenDto> {
    const sessions = await this.scheduleRepository.find({
      select: { filmId: { id: true }, id: true, taken: true, rows: true, seats: true },
      relations: { filmId: true },
      where: { id: In(ids) }
    });

    return sessions.map(elem => {
      return {
        filmId: elem.filmId.id,
        sessionId: elem.id,
        taken: elem.taken.split(','),
        rows: elem.rows,
        seats: elem.seats
      };
    });
  }

  async updatePlaces(seatsToTakeOnSession: ISeatsToTakeOnSession): Promise<void> {
    const seatsToTake = seatsToTakeOnSession.seatsToTake.join(',') + ',';
    await this.scheduleRepository
      .createQueryBuilder()
      .update()
      .set({ taken: () => `concat(taken, '${seatsToTake}')` })
      .where(`id = '${seatsToTakeOnSession.sessionId}'`)
      .execute();
  }
}
