import { IsString } from 'class-validator';

export class PaymentCardDto {
  @IsString({ groups: ['on-site'] })
  number: string;

  @IsString({ groups: ['on-site'] })
  exp_month: string;

  @IsString({ groups: ['on-site'] })
  exp_year: string;

  @IsString({ groups: ['on-site'] })
  cvc: string;
}
