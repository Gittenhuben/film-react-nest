import { Schema } from 'mongoose';

import { ISessionDatabase } from '../../films/dto/films.dto';

export const scheduleSchema = new Schema<ISessionDatabase>({
  id: { type: String, required: true },
  daytime: { type: String, required: true },
  hall: { type: Number, required: true },
  rows: { type: Number, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  taken: { type: [String], required: true }
});
