import { FilmsDatabaseDto, ScheduleDatabaseDto } from '../films/dto/films.dto';
import { TakenDto, ISeatsToTakeOnSession } from '../order/dto/order.dto';

export interface FilmsRepository {
  findAllFilms: () => Promise<FilmsDatabaseDto>;
  findSchedulesByFilmId: (id: string) => Promise<ScheduleDatabaseDto>;
  findTakenBySessionIds: (ids: string[]) => Promise<TakenDto>;
  updatePlaces: (seatsToTakeOnSession: ISeatsToTakeOnSession) => Promise<void>;
}
