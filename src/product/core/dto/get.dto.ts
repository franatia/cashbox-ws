import { ProductOriginType, ProductSubtractType, ProductUnit } from "@/product/entities/product.entity"
import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator";

export default class GetDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    searchText ?: string;

    @IsOptional()
    @IsIn([
        ProductSubtractType.CONCEPTUAL,
        ProductSubtractType.IMMEDIATE,
        ProductSubtractType.NONE
    ])
    subtractType?: ProductSubtractType;

    @IsOptional()
    @IsIn([
        ProductOriginType.DROPSHIPPING,
        ProductOriginType.OWN
    ])
    originType?: ProductOriginType;

    @IsOptional()
    @IsIn([
        ProductUnit.G,
        ProductUnit.KG,
        ProductUnit.L,
        ProductUnit.ML,
        ProductUnit.UNIT,
    ])
    unit?: ProductUnit;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    allowReservation?: boolean;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    visibility?: boolean;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    active?: boolean;

    @IsOptional()
    @IsUUID()
    groupId?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    groupPath ?: string;

    @IsOptional()
    @IsUUID()
    brandId?: string;

    @IsOptional()
    @IsUUID()
    catalogId?: string;

    @IsOptional()
    @IsUUID()
    linkingCatalogId?: string;

    @IsOptional()
    @IsUUID()
    linkingProductId?: string;

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