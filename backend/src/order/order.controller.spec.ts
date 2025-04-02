import { Test } from '@nestjs/testing';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

describe('Order Controller Routes', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService]
    })
      .overrideProvider(OrderService)
      .useValue({
        processOrder: jest.fn()
      })
      .compile();

    controller = moduleRef.get<OrderController>(OrderController);
    service = moduleRef.get<OrderService>(OrderService);
  });

  it('Post /order', () => {
    const order: OrderDto = {
      email: '123',
      phone: '123',
      tickets: [
        {
          film: '123',
          session: '123',
          daytime: '123',
          row: 1,
          seat: 1,
          price: 1
        }
      ]
    };

    controller.create(order);
    expect(service.processOrder).toHaveBeenCalledWith(order);
  });
});
