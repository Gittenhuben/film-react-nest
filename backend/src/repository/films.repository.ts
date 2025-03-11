import { FilmsDatabaseDto, ScheduleDatabaseDto } from '../films/dto/films.dto';
import { TakenDto, ISeatsToTakeOnSession } from '../order/dto/order.dto';

export abstract class FilmsRepository {
  abstract findAllFilms: () => Promise<FilmsDatabaseDto>;
  abstract findSchedulesByFilmId: (id: string) => Promise<ScheduleDatabaseDto>;
  abstract findTakenBySessionIds: (ids: string[]) => Promise<TakenDto>;
  abstract updatePlaces: (seatsToTakeOnSession: ISeatsToTakeOnSession) => Promise<void>;
}
