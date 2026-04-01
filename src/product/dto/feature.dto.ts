import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsObject, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { FeatureValueDto } from "./feature-value.dto";

export class FeatureDto {
    @IsUUID()
    id !: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type(() => FeatureValueDto)
    values !: FeatureValueDto[];
    
    @IsInt()
    level !: number;

    @IsOptional()
    @IsBoolean()
    createItemsGroup !: boolean;

}