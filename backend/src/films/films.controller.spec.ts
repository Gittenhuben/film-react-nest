import { Test } from '@nestjs/testing';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('Films Controller Routes', () => {
  let controller: FilmsController;
  let service: FilmsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService]
    })
      .overrideProvider(FilmsService)
      .useValue({
        getAll: jest.fn(),
        getSchedulesByFilmId: jest.fn()
      })
      .compile();

    controller = moduleRef.get<FilmsController>(FilmsController);
    service = moduleRef.get<FilmsService>(FilmsService);
  });

  it('Get /films', () => {
    controller.getAll();
    expect(service.getAll).toHaveBeenCalled();
  });

  it('Get /films/:id/schedule', () => {
    const filmId = '123';
    controller.getSchedulesByFilmId(filmId);
    expect(service.getSchedulesByFilmId).toHaveBeenCalledWith(filmId);
  });
});
