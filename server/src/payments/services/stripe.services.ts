import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export default class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_KEY'), {
      apiVersion: '2020-08-27',
    });
  }

  public async charge(currency: string, amount: number, token: string) {
    return this.stripe.charges.create({
      currency,
      amount: amount * 100,
      source: token,
    });
  }

  public async createToken(
    card: Stripe.TokenCreateParams.Card,
  ): Promise<Stripe.Response<Stripe.Token>> {
    return this.stripe.tokens.create({ card });
  }
}
