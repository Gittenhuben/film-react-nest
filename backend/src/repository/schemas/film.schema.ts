import { Schema } from 'mongoose';

import { IFilmDatabase } from '../../films/dto/films.dto';
import { scheduleSchema } from './schedule.schema';

export const filmSchema = new Schema<IFilmDatabase>({
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
