import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export default class UpdateDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsBoolean()
    webVisibility?: boolean;

    @IsOptional()
    @IsNumber()
    baseCost?: number;

    @IsOptional()
    @IsNumber()
    basePrice?: number;

    @UUIDValidator({
        optional : true
    })
    costId ?: string;

}