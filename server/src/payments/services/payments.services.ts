import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from '../../orders/models/order-status.enum';
import { Order } from '../../orders/models/order.entity';
import { OrderRepository } from '../../orders/models/order.repository';
import { FindConditions } from 'typeorm';
import { CreatePaymentDto } from '../dto/createPayment.dto';
import { PaymentCurrency } from '../models/payment-currency.enum';
import { PaymentService } from '../models/payment-service.enum';
import { PaymentStatus } from '../models/payment-status.enum';
import { Payment } from '../models/payment.entity';
import { PaymentRepository } from '../models/payment.repository';
import StripeService from './stripe.services';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentRepository)
    protected paymentRepository: PaymentRepository,
    private stripeService: StripeService,
    private orderRepository: OrderRepository,
  ) {}

  async list(filterDto: FindConditions<Payment>): Promise<Payment[]> {
    return this.paymentRepository.getPayments(filterDto);
  }

  async getPaymentById(id: number): Promise<Payment> {
    const existingFeed = await this.paymentRepository.findOne(id, {
      relations: ['order'],
    });
    if (!existingFeed) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }
    return existingFeed;
  }

  async createStripePaymentWithCard(
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    try {
      const relatedOrder = await this.getRelatedOrder(createPaymentDto.order);
      const token = await this.stripeService.createToken(createPaymentDto.card);
      createPaymentDto.paymentToken = token.id;
      delete createPaymentDto.card;
      return this.createStripePaymentWithToken(createPaymentDto, relatedOrder);
    } catch (err) {
      throw err;
    }
  }

  async createStripePaymentWithToken(
    createPaymentDto: CreatePaymentDto,
    order?: Order,
  ): Promise<Payment> {
    try {
      const relatedOrder =
        order || (await this.getRelatedOrder(createPaymentDto.order));

      const charge = await this.stripeService.charge(
        PaymentCurrency.USD,
        relatedOrder.price,
        createPaymentDto.paymentToken,
      );

      createPaymentDto.paymentService = PaymentService.STRIPE;
      createPaymentDto.status = PaymentStatus.SUCCESS;
      createPaymentDto.chargeId = charge.id;
      createPaymentDto.currency = PaymentCurrency.USD;
      const payment = this.paymentRepository.createPayment(createPaymentDto);

      relatedOrder.status = OrderStatus.COMPLETE;
      await relatedOrder.save();

      return payment;
    } catch (err) {
      throw err;
    }
  }

  private async getRelatedOrder(order: Order): Promise<Order> {
    const relatedOrder = await this.orderRepository.findOneOrFail(order);

    if (this.isNotValidOrderStatus(relatedOrder.status)) {
      throw new BadRequestException(`Invalid order`);
    }

    return relatedOrder;
  }

  private isNotValidOrderStatus(orderStatus): boolean {
    return !!(
      orderStatus === OrderStatus.COMPLETE ||
      orderStatus === OrderStatus.CANCELLED
    );
  }
}
