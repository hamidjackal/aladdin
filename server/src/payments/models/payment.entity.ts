import { Order } from '../../orders/models/order.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentCurrency } from './payment-currency.enum';
import { PaymentService } from './payment-service.enum';
import { PaymentStatus } from './payment-status.enum';

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: [PaymentStatus.PENDING, PaymentStatus.FAILURE, PaymentStatus.SUCCESS],
  })
  status: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: [PaymentService.STRIPE],
  })
  paymentService: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: [PaymentCurrency.USD],
  })
  currency: string;

  @Column()
  chargeId: string;

  @ManyToOne(() => Order, (order) => order.payments, {
    nullable: false,
  })
  order: Order;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamp',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: false,
    type: 'timestamp',
    default: () => 'now()',
  })
  updatedAt: Date;
}
