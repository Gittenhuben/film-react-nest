import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsInt, IsString, IsNotEmpty, IsNumber } from 'class-validator';

import { FilmEntity } from './film.entity';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  daytime: string;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'integer', nullable: false })
  hall: number;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'integer', nullable: false })
  rows: number;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'integer', nullable: false })
  seats: number;

  @IsNotEmpty()
  @IsNumber()
  @Column({ type: 'double precision', nullable: false })
  price: number;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'text', nullable: false })
  taken: string;

  @ManyToOne(() => FilmEntity)
  @JoinColumn({ name: 'filmId' })
  filmId: FilmEntity;
}
