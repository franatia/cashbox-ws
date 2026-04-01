import { Type } from "class-transformer";
import { IsArray, IsUUID, ValidateNested } from "class-validator";
import { FeatureDto } from "./feature.dto";

export default class CreateProductItemsDto {

    @IsUUID()
    productId !: string;

    @IsUUID()
    projectId !: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FeatureDto)
    features !: FeatureDto[];

}