export interface IFilm {
  id: string;
  rating: number;
  director: string;
  tags: string[] | string;
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

export interface IFilmDatabase extends IFilm {
  schedule: ISessionDatabase[];
}

export class FilmsDatabaseDto {
  films: IFilm[];
}

export class FilmsResponseDto {
  items: IFilm[];
  total: number;
}

export interface ISession {
  id: string;
  daytime: string;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[] | string;
}

export interface ISessionDatabase extends Omit<ISession, 'hall'> {
  hall: number;
}

export class ScheduleDatabaseDto {
  schedule: ISessionDatabase[];
}

export class ScheduleResponseDto {
  items: ISession[];
  total: number;
}
