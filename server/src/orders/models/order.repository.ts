import { Order } from './order.entity';
import { EntityRepository, FindConditions, Repository } from 'typeorm';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { parseQuery } from '../../core/utils/parse-query';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async getOrders(filterDto: FindConditions<Order>): Promise<Order[]> {
    const parsedFilterDto = parseQuery(filterDto);
    const orders: Order[] = await Order.find(parsedFilterDto);
    return orders;
  }

  async createOrder(createOrder: CreateOrderDto): Promise<Order> {
    try {
      const order = new Order();
      Object.assign(order, createOrder);
      return await order.save();
    } catch (err) {
      if (err.detail && err.code === '23505') {
        throw new ConflictException(err.detail);
      }
      throw new BadRequestException(err);
    }
  }
}
