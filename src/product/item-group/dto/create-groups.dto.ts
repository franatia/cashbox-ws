import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { FeatureDto } from "../../features/dto/feature.dto";

export default class CreateProductItemGruopsDto {

    @IsUUID()
    projectId !: string;

    @IsUUID()
    productId !: string;

    @IsUUID()
    featureGroupId !: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FeatureDto)
    features !: FeatureDto[];

}