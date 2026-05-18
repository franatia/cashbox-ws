import { IsUUID, IsEnum, IsArray, ValidateNested, IsOptional, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Channel } from '@/common/constants/channel.enum';

export class OrderDetailDto {
  @IsUUID()
  @IsNotEmpty()
  productItemId!: string;

  @IsInt()
  quantity!: number;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsOptional()
  @IsInt()
  discount?: number;

  @IsOptional()
  @IsUUID()
  priceListId?: string;
}

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @IsOptional()
  @IsUUID()
  sourceNodeId?: string; // Node to subtract stock from

  @IsOptional()
  @IsUUID()
  targetNodeId?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsEnum(Channel)
  channel!: Channel;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  details!: OrderDetailDto[];
}
