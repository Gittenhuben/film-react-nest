import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class Ticket {
  @IsNotEmpty()
  @IsString()
  film: string;
  @IsNotEmpty()
  @IsString()
  session: string;
  @IsNotEmpty()
  @IsString()
  daytime: string;
  @IsNotEmpty()
  @IsNumber()
  row: number;
  @IsNotEmpty()
  @IsNumber()
  seat: number;
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class OrderDto {
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => Ticket)
  tickets: Ticket[];
}

export interface ITicketResponse extends Ticket {
  id: string;
}

export class OrderResponseDto {
  items: ITicketResponse[];
  total: number;
}

export interface ITakenInfo {
  filmId: string;
  sessionId: string;
  taken: string[];
  rows: number;
  seats: number;
}

export type TakenDto = ITakenInfo[];

export interface ISeatsToTakeOnSession {
  sessionId: string;
  seatsToTake: string[];
}
