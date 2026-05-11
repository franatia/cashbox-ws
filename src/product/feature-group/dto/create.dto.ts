import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { FeatureDto } from "../../features/dto/feature.dto";
import { ContextFeatureDto } from "./context-feature.dto";

export default class CreateDto {

    @IsUUID()
    productId !: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({each : true})
    @Type(() => ContextFeatureDto)
    features !: ContextFeatureDto[]

    @IsOptional()
    @IsBoolean()
    createFeatureContext ?: boolean;
    
}