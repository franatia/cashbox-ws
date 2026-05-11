import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsUUID, ValidateNested } from "class-validator";
import ItemDto from "./item.dto";

export default class CreateManyDto {

    @IsUUID()
    productId !: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({each : true})
    @Type(() => ItemDto)
    items !: ItemDto[]

}