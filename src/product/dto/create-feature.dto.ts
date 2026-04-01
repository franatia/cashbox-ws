import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export default class CreateFeatureDto {

    @IsString()
    @IsNotEmpty()
    name !: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({each: true})
    values !: string[];

    @IsOptional()
    @IsUUID()
    schema !: string;

}