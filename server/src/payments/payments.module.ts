import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from 'src/orders/models/order.repository';
import { PaymentsController } from './controllers/payments.controllers';
import { PaymentRepository } from './models/payment.repository';
import { PaymentsService } from './services/payments.services';
import StripeService from './services/stripe.services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([PaymentRepository, OrderRepository]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeService],
})
export class PaymentsModule {}
