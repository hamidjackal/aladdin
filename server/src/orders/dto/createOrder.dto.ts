import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { OrderStatus } from '../models/order-status.enum';

export class CreateOrderDto {
  @IsString()
  title: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status: string;
}
