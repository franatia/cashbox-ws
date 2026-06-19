import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ProductSubtractType, ProductUnit } from '../../entities/product.entity';
import { UUIDValidator } from '@/common/decorators/validator/uuid.validator';

export class UpdateDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name ?: string;

    @IsOptional()
    @IsUUID()
    brandId ?: string;

    @IsOptional()
    @IsString()
    description ?: string;

    @IsOptional()
    @IsInt()
    basePrice ?: number;

    @IsOptional()
    @IsBoolean()
    visibility ?: boolean;

    @IsOptional()
    @IsBoolean()
    active ?: boolean;

    @IsOptional()
    @IsEnum(ProductSubtractType)
    subtractType ?: ProductSubtractType;
    
    @IsOptional()
    @IsEnum(ProductUnit)
    unit ?: ProductUnit;

    @UUIDValidator({
        optional : true
    })
    costId ?: string;

}
