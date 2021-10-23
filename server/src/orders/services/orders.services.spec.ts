import { Test } from '@nestjs/testing';
import { Order } from '../models/order.entity';
import { OrderRepository } from '../models/order.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.services';
import { DeleteResult, UpdateResult } from 'typeorm';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const fakeOrderRepository: Partial<OrderRepository> = {
      getOrders: () => Promise.resolve([]),
      findOne: (id) => {
        if (id === 1) {
          return Promise.resolve({ id: 1 } as Order);
        } else {
          return undefined;
        }
      },
      delete: ({ id }: { id: number }) => {
        if (id === 1) {
          return Promise.resolve({ affected: 1 } as DeleteResult);
        } else {
          return Promise.resolve({ affected: 0 } as DeleteResult);
        }
      },
      update: (id) => {
        if (id === 1) {
          return Promise.resolve({ affected: 1 } as UpdateResult);
        } else {
          return Promise.resolve({ affected: 0 } as UpdateResult);
        }
      },
      createOrder: () => Promise.resolve({ id: 1 } as Order),
      findOneOrFail: (id) => {
        if (id === 1) {
          return Promise.resolve({
            id: 1,
            status: 'created',
            payments: [],
            save: () => Promise.resolve({ id: 1, payments: [] }),
          } as Order);
        } else if (id === 2) {
          return Promise.resolve({
            id: 2,
            status: 'complete',
            save: () => Promise.resolve({ id: 2, status: 'complete' }),
          } as Order);
        } else if (id === 3) {
          return Promise.resolve({
            id: 3,
            status: 'cancelled',
            save: () => Promise.resolve({ id: 2, status: 'complete' }),
          } as Order);
        } else if (id === 4) {
          return Promise.resolve({
            id: 4,
            status: 'created',
            payments: [],
            save: () => Promise.resolve({ id: 2, status: 'created' }),
          } as Order);
        } else {
          return Promise.reject();
        }
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrderRepository,
          useValue: fakeOrderRepository,
        },
      ],
    }).compile();

    service = module.get(OrdersService);
  });

  it('can create an instance of order service', async () => {
    expect(service).toBeDefined();
  });

  it('get orders list', async () => {
    const orders = await service.list({});
    expect(orders).toEqual([]);
  });

  it('get order by valid id', async () => {
    const orders = await service.getOrderById(1);
    expect(orders).toEqual({ id: 1 });
  });

  it('get order by invalid id', async () => {
    expect.assertions(1);
    await expect(service.getOrderById(2)).rejects.toEqual(
      new NotFoundException(`Order with ID "2" not found`),
    );
  });

  it('delete order by id', async () => {
    const deleteResp = await service.deleteOrder(1);
    expect(deleteResp.affected).toEqual(1);
  });

  it('delete order by invalid status', async () => {
    await expect(service.deleteOrder(2)).rejects.toEqual(
      new BadRequestException(`Invalid order to delete`),
    );
  });

  it('delete order by invalid id', async () => {
    await expect(service.deleteOrder(4)).rejects.toEqual(
      new NotFoundException(`Order with ID "4" not found`),
    );
  });

  it('update order by invalid status', async () => {
    await expect(
      service.updateOrder(2, { title: 'new', price: 10 }),
    ).rejects.toEqual(new BadRequestException(`Invalid order to update`));
  });

  it('update order by invalid id', async () => {
    await expect(
      service.updateOrder(4, { title: 'new', price: 10 }),
    ).rejects.toEqual(new BadRequestException(`No order updated`));
  });
});
