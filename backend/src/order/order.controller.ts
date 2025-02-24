import { Controller, Post, Body } from '@nestjs/common';

import { OrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() orderDto: OrderDto) {
    return this.orderService.processOrder(orderDto);
  }
}
