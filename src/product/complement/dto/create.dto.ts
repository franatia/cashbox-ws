import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ComplementType } from "../../entities/complement.entity";

export class CreateDto {

    @IsUUID()
    productId !: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", {each : true})
    itemsId !: string[];

    @IsString()
    @IsNotEmpty()
    name !: string;

    @IsBoolean()
    isQuantitySelectable !: boolean;

    @IsBoolean()
    isOptional !: boolean;

    @IsEnum(ComplementType)
    type !: ComplementType;

    @IsOptional()
    @IsUUID()
    priceListId ?: string;

    @IsOptional()
    @IsInt()
    defaultQuantity ?: number;

}