import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.services';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { DeleteResult, FindConditions, UpdateResult } from 'typeorm';
import { Order } from '../models/order.entity';
import { UpdateOrderDto } from '../dto/updateOrder.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Get()
  async list(@Query() filterDto: FindConditions<Order>): Promise<Order[]> {
    return this.orderService.list(filterDto);
  }

  @Get('/:id')
  async getOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Put('/:id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async updateOrderById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<UpdateResult> {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete('/:id')
  async deleteOrder(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteResult> {
    return this.orderService.deleteOrder(id);
  }
}
