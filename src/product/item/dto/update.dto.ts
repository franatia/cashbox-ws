import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export default class UpdateDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name !: string;

    @IsOptional()
    @IsBoolean()
    webVisibility !: boolean;

}