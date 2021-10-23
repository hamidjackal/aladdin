import { Test } from '@nestjs/testing';
import { Order } from '../../orders/models/order.entity';
import Stripe from 'stripe';
import { OrderRepository } from '../../orders/models/order.repository';
import { Payment } from '../models/payment.entity';
import { PaymentRepository } from '../models/payment.repository';
import { PaymentsService } from './payments.services';
import StripeService from './stripe.services';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const fakeStripeService: Partial<StripeService> = {
      charge: () =>
        Promise.resolve({ id: 'ch_ldfsjd' } as Stripe.Response<Stripe.Charge>),
      createToken: () =>
        Promise.resolve({ id: 'tok_test' } as Stripe.Response<Stripe.Token>),
    };
    const fakePaymentRepository: Partial<PaymentRepository> = {
      getPayments: () => Promise.resolve([]),
      createPayment: () => Promise.resolve({ id: 1 } as Payment),
      findOne: (id) => {
        if (id === 1) {
          return Promise.resolve({ id: 1 } as Payment);
        } else {
          return undefined;
        }
      },
    };
    const fakeOrderRepository: Partial<OrderRepository> = {
      findOneOrFail: (id) => {
        if (id === 1) {
          return Promise.resolve({
            id: 1,
            status: 'created',
            save: () => Promise.resolve({ id: 1 }),
          } as Order);
        } else if (id === 2) {
          return Promise.resolve({
            id: 2,
            status: 'complete',
            save: () => Promise.resolve({ id: 2, status: 'complete' }),
          } as Order);
        } else if (id === 3) {
          return Promise.resolve({
            id: 3,
            status: 'cancelled',
            save: () => Promise.resolve({ id: 2, status: 'complete' }),
          } as Order);
        } else {
          return Promise.reject();
        }
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: StripeService,
          useValue: fakeStripeService,
        },
        {
          provide: PaymentRepository,
          useValue: fakePaymentRepository,
        },
        {
          provide: OrderRepository,
          useValue: fakeOrderRepository,
        },
      ],
    }).compile();

    service = module.get(PaymentsService);
  });

  it('can create an instance of payment service', async () => {
    expect(service).toBeDefined();
  });

  it('get payments list', async () => {
    const payments = await service.list({});
    expect(payments).toEqual([]);
  });

  it('get payment by valid id', async () => {
    const payments = await service.getPaymentById(1);
    expect(payments).toEqual({ id: 1 });
  });

  it('get payment by invalid id', async () => {
    await expect(service.getPaymentById(2)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('create stripe payment with card specification(on-site)', async () => {
    const payments = await service.createStripePaymentWithCard({
      //@ts-ignore
      order: 1,
      card: {
        number: '123',
        exp_month: '12',
        exp_year: '2022',
        cvc: '213',
      },
    });
    expect(payments).toEqual({ id: 1 });
  });

  it('create stripe payment with token(off-site)', async () => {
    const payments = await service.createStripePaymentWithCard({
      //@ts-ignore
      order: 1,
      paymentToken: 'tok_sdds',
    });
    expect(payments).toEqual({ id: 1 });
  });

  it('throw err if the order does not exists', async () => {
    try {
      await service.createStripePaymentWithCard({
        //@ts-ignore
        order: 4,
        paymentToken: 'tok_sdds',
      });
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });

  it('throw err if the order status is complete', async () => {
    try {
      await service.createStripePaymentWithCard({
        //@ts-ignore
        order: 2,
        paymentToken: 'tok_sdds',
      });
    } catch (err) {
      expect(err).toEqual(new BadRequestException('Invalid order'));
    }
  });

  it('throw err if the order status is cancelled', async () => {
    try {
      await service.createStripePaymentWithCard({
        //@ts-ignore
        order: 3,
        paymentToken: 'tok_sdds',
      });
    } catch (err) {
      expect(err).toEqual(new BadRequestException('Invalid order'));
    }
  });
});
