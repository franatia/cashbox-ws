import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsUUID, MinLength, ValidateNested } from "class-validator";
import CreateFeatureDto from "./create-feature.dto";

export class CreateFeaturesDto {

    @IsUUID()
    projectId !: string;

    @IsUUID()
    productId !: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({each: true})
    @Type(() => CreateFeatureDto)
    features !: CreateFeatureDto[];

}