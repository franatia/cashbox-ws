import { IsNotEmpty, IsOptional, IsSemVer, IsString, IsUUID } from "class-validator";

export default class UpdateDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    value ?: string;

}