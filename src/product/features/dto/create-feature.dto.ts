import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export default class CreateFeatureDto {

    @IsString()
    @IsNotEmpty()
    name !: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({each: true})
    values !: string[];
    
    @IsOptional()
    @IsNumber()
    level ?: number;

    @IsOptional()
    @IsBoolean()
    main ?: boolean;

}