import { Type } from "class-transformer";
import { IsInt, IsUUID, Min } from "class-validator";

export default class ItemDto {
    
    @IsUUID()
    id !: string;

    @IsInt()
    @Min(0)
    quantity !: number;

}