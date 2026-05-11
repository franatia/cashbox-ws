import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateDto {

    @IsUUID()
    featureId !: string;

    @IsString()
    @IsNotEmpty()
    value !: string;

}