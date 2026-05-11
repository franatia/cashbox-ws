import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, IsUUID, MinLength, ValidateNested } from "class-validator";
import CreateFeatureDto from "./create-feature.dto";

export class CreateFeaturesDto {

    @IsUUID()
    productId !: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({each: true})
    @Type(() => CreateFeatureDto)
    features !: CreateFeatureDto[];

    @IsOptional()
    @IsBoolean()
    createFeatureContext ?: string;

}