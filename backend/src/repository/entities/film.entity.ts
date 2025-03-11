import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

import { ScheduleEntity } from './schedule.entity';

@Entity('films')
export class FilmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty()
  @IsString()
  director: string;

  @Column({ type: 'text', nullable: false })
  @IsNotEmpty()
  @IsString()
  tags: string;

  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty()
  @IsString()
  image: string;

  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty()
  @IsString()
  cover: string;

  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty()
  @IsString()
  about: string;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  description: string;

  @OneToMany(() => ScheduleEntity, scheduleEntity => scheduleEntity.filmId)
  schedules: ScheduleEntity[];
}
