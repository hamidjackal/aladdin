import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindConditions, UpdateResult } from 'typeorm';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { UpdateOrderDto } from '../dto/updateOrder.dto';
import { OrderStatus } from '../models/order-status.enum';
import { Order } from '../models/order.entity';
import { OrderRepository } from '../models/order.repository';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderRepository)
    protected orderRepository: OrderRepository,
  ) {}

  async list(filterDto: FindConditions<Order>): Promise<Order[]> {
    return this.orderRepository.getOrders(filterDto);
  }

  async getOrderById(id: number): Promise<Order> {
    const existingFeed = await this.orderRepository.findOne(id);
    if (!existingFeed) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return existingFeed;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderRepository.createOrder(createOrderDto);
  }

  async deleteOrder(id: number): Promise<DeleteResult> {
    try {
      const existingOrder = await this.orderRepository.findOneOrFail(id, {
        relations: ['payments'],
      });

      if (this.isOrderValidToUpdate(existingOrder)) {
        throw new BadRequestException('Invalid order to delete');
      }

      const result = await this.orderRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<UpdateResult> {
    try {
      const existingOrder = await this.orderRepository.findOneOrFail(id, {
        relations: ['payments'],
      });
      if (this.isOrderValidToUpdate(existingOrder)) {
        throw new BadRequestException('Invalid order to update');
      }

      const response: UpdateResult = await this.orderRepository.update(
        { id },
        updateOrderDto,
      );

      if (response.affected) {
        return response;
      }
      throw new BadRequestException('No order updated');
    } catch (err) {
      throw err;
    }
  }

  private isOrderValidToUpdate(order: Order): boolean {
    return !!(order.status !== OrderStatus.CREATED || order?.payments.length);
  }
}
