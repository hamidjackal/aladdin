import { Payment } from '../../payments/models/payment.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from './order-status.enum';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  price: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: [
      OrderStatus.CREATED,
      OrderStatus.CANCELLED,
      OrderStatus.AWAITING_PAYMENT,
      OrderStatus.COMPLETE,
    ],
    default: OrderStatus.CREATED,
  })
  status: string;

  @OneToMany(() => Payment, (payment) => payment.order, { cascade: true })
  payments: Payment[];

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
