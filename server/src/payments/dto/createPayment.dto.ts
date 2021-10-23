import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Order } from '../../orders/models/order.entity';
import { PaymentCurrency } from '../models/payment-currency.enum';
import { PaymentService } from '../models/payment-service.enum';
import { PaymentStatus } from '../models/payment-status.enum';
import { PaymentCardDto } from './paymentCardDto.dto';

export class CreatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status: string;

  @IsNotEmpty({ groups: ['off-site', 'on-site'] })
  @IsNumber()
  order: Order;

  @IsOptional({ groups: ['off-site', 'on-site'] })
  @IsEnum(PaymentCurrency)
  currency: string;

  @IsOptional({ groups: ['off-site', 'on-site'] })
  @IsEnum(PaymentService)
  paymentService: string;

  @IsString({ groups: ['off-site'] })
  paymentToken: string;

  @ValidateNested({ groups: ['on-site'] })
  @Type(() => PaymentCardDto)
  card: PaymentCardDto;

  @IsOptional()
  chargeId: string;
}
