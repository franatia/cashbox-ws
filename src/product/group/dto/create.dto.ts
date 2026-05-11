import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export default class CreateDto {

    @IsOptional()
    @IsUUID()
    parentGroupId !: string | undefined;

    @IsString()
    @IsNotEmpty()
    name !: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", { each: true })
    productsId !: string[];

}