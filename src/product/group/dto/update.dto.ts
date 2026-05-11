import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export default class UpdateDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name ?: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", {each : true})
    productsId ?: string[];

    @IsOptional()
    @IsBoolean()
    visibility ?: boolean;

}