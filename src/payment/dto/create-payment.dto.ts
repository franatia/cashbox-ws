import { IsUUID, IsEnum, IsInt, IsOptional, IsNotEmpty } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../entities/payment.enum';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @IsInt()
  total!: number;

  @IsOptional()
  @IsUUID()
  orderId?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}
