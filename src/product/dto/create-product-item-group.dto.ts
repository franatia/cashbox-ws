import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export default class CreateProductItemGroupDto {

    @IsUUID()
    projectId !: string;

    @IsUUID()
    productId !: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", {each:true})
    productItemIds !: string[] | null;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @IsUUID("4", {each: true})
    featureValueIds !: string[] | null;

    @IsOptional()
    @IsString()
    name !: string | null;

    @IsBoolean()
    webVisibility !: boolean;

    @IsOptional()
    @IsInt()
    basePrice !: number | null;

    @IsBoolean()
    basedOnFeatures !: boolean;

}