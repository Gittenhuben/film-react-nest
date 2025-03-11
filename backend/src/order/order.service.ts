import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { FilmsRepository } from '../repository/films.repository';
import { OrderDto, TakenDto, OrderResponseDto, ISeatsToTakeOnSession } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async processOrder(orderDto: OrderDto): Promise<OrderResponseDto> {
    const takenDto: TakenDto = await this.filmsRepository.findTakenBySessionIds(
      orderDto.tickets.map(ticket => ticket.session)
    );

    const seatsToTakeOnSessions: ISeatsToTakeOnSession[] = [];

    orderDto.tickets.forEach(ticket => {
      const takenInfo = takenDto.find(takenInfo => takenInfo.sessionId === ticket.session);
      if (ticket.film !== takenInfo.filmId) {
        throw new BadRequestException('Некорректный ID фильма');
      }
      if (ticket.row < 1 || ticket.row > takenInfo.rows) {
        throw new BadRequestException('Некорректный номер ряда в билете');
      }
      if (ticket.seat < 1 || ticket.seat > takenInfo.seats) {
        throw new BadRequestException('Некорректный номер места в билете');
      }

      const ticketSeatKey = [ticket.row, ticket.seat].join(':');
      if (takenInfo.taken.some(elem => elem === ticketSeatKey)) {
        throw new BadRequestException('Место уже занято');
      }

      const sessionIndex = seatsToTakeOnSessions.findIndex(elem => elem.sessionId === ticket.session);
      if (sessionIndex > -1) {
        if (seatsToTakeOnSessions[sessionIndex].seatsToTake.some(elem => elem === ticketSeatKey)) {
          throw new BadRequestException('Два билета на одно место в заказе');
        }
        seatsToTakeOnSessions[sessionIndex].seatsToTake.push(ticketSeatKey);
      } else {
        seatsToTakeOnSessions.push({
          sessionId: ticket.session,
          seatsToTake: [ticketSeatKey]
        });
      }
    });

    await Promise.all(
      seatsToTakeOnSessions.map(seatsToTakeOnSession => {
        this.filmsRepository.updatePlaces(seatsToTakeOnSession);
      })
    );

    return {
      items: orderDto.tickets.map(elem => {
        return {
          id: uuidv4(),
          ...elem
        };
      }),
      total: orderDto.tickets.length
    };
  }
}
