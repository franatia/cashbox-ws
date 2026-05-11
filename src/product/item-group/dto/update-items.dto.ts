import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export default class UpdateItemsDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", {each : true})
    itemsId !: string[]
}