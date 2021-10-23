import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentsService } from '../services/payments.services';
import { CreatePaymentDto } from '../dto/createPayment.dto';
import { FindConditions } from 'typeorm';
import { Payment } from '../models/payment.entity';

@Controller('api/payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Get()
  async list(@Query() filterDto: FindConditions<Payment>): Promise<Payment[]> {
    return this.paymentService.list(filterDto);
  }

  @Get('/:id')
  async getPaymentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Payment> {
    return this.paymentService.getPaymentById(id);
  }

  @Post('/stripe/off-site')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      groups: ['off-site'],
    }),
  )
  async createStripePaymentOffSite(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.createStripePaymentWithToken(createPaymentDto);
  }

  @Post('/stripe/on-site')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      groups: ['on-site'],
    }),
  )
  async createStripePaymentOnSite(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.createStripePaymentWithCard(createPaymentDto);
  }
}
