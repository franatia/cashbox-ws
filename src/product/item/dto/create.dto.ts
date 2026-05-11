import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export default class CreateDto {

    @IsUUID()
    productId !: string;

    @IsString()
    @IsNotEmpty()
    name !: string;

}