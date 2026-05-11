import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ProductSubtractType, ProductUnit } from "../../entities/product.entity";

export class CreateDto {

    @IsString()
    @IsNotEmpty()
    name !: string;
        
    @IsInt()
    basePrice !: number;

    @IsEnum(ProductSubtractType)
    subtractType !: ProductSubtractType;

    @IsEnum(ProductUnit)
    unit !: ProductUnit

    @IsOptional()
    @IsUUID()
    brandId ?: string;

    @IsOptional()
    @IsString()
    description ?: string;

    @IsOptional()
    @IsBoolean()
    visibility ?: boolean;

}
