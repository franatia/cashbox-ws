import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class UpdateDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name ?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description ?: string;

}