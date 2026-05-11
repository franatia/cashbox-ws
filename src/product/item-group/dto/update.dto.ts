import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class UpdateDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name ?: string;

    @IsOptional()
    @IsBoolean()
    webVisibility ?: boolean;

    @IsOptional()
    @IsInt()
    basePrice ?: number;

}