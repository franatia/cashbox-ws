import { ComplementType } from "@/product/entities/complement.entity";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export default class UpdateDto {

    @IsOptional()
    @IsBoolean()
    isQuantitySelectable ?: boolean;

    @IsOptional()
    @IsBoolean()
    isOptional ?: boolean;

    @IsOptional()
    @IsEnum(ComplementType)
    type ?: ComplementType;
    
    @IsOptional()
    @IsInt()
    defaultQuantity?: number;

    @IsOptional()
    @IsUUID()
    priceListId ?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name ?: string;

}