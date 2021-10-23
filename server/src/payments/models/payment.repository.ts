import { Payment } from './payment.entity';
import { EntityRepository, FindConditions, Repository } from 'typeorm';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/createPayment.dto';

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {
  async getPayments(filterDto: FindConditions<Payment>): Promise<Payment[]> {
    const payments: Payment[] = await Payment.find(filterDto);
    return payments;
  }

  async createPayment(createPayment: CreatePaymentDto): Promise<Payment> {
    try {
      const payment = new Payment();
      Object.assign(payment, createPayment);
      return await payment.save();
    } catch (err) {
      if (err.detail && err.code === '23505') {
        throw new ConflictException(err.detail);
      }
      throw new BadRequestException(err);
    }
  }
}
