import { ItemGroupType } from "@/product/entities/item-group.entity";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export default class CreateDto {

    @IsUUID()
    productId !: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsIn([ItemGroupType.FEATURES, ItemGroupType.ITEMS])
    type !: ItemGroupType

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", { each: true })
    itemsId?: string[];

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", { each: true })
    featureValuesId?: string[];

    @IsOptional()
    @IsBoolean()
    webVisibility ?: boolean;
    
    @IsOptional()
    @IsInt()
    basePrice ?: number;

}