import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator";

export default class GetDto {

    /***
     *
     *  Query find by name or sku 
     * 
     */

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    searchText !: string;

    @IsOptional()
    @IsUUID()
    productId !: string;

    @IsOptional()
    @IsUUID()
    groupId !: string;

    @IsOptional()
    @IsUUID()
    featureGroupId !: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", { each: true })
    featureValuesId !: string[];

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