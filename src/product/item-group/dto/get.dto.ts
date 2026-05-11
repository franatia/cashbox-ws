import { ItemGroupType } from "@/product/entities/item-group.entity";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator";

export default class GetDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    searchText?: string;

    @IsOptional()
    @IsEnum(ItemGroupType)
    type?: ItemGroupType;

    @IsOptional()
    @IsUUID()
    productId?: string;

    @IsOptional()
    @IsUUID()
    featureGroupId?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    skip: number = 0;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    take: number = 6;

}