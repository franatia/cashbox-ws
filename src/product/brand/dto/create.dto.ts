import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class CreateDto {

    @IsString()
    @IsNotEmpty()
    name !: string;

    @IsOptional()
    @IsString()
    description ?: string
    
}