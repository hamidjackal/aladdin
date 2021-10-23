import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price: number;
}
