import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ProductSubtractType } from "../entities/product.entity";

export class CreateProductDto {

    @IsUUID()
    projectId !: string;

    @IsString()
    @IsNotEmpty()
    name !: string;
    
    @IsOptional()
    @IsUUID()
    brandId !: string;
    
    @IsInt()
    basePrice !: number;

    @IsOptional()
    @IsString()
    description !: string | null;

    @IsEnum(ProductSubtractType)
    subtractType !: ProductSubtractType;

    @IsBoolean()
    webVisibility !: boolean;

}
