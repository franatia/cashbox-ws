import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class CreateItemsDto {

    @IsUUID()
    complementId !: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", {each : true})
    itemsId !: string[]

}