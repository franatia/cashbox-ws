import { IsInt, IsUUID, Min } from "class-validator";

export default class CreateDto {
    
    @IsUUID()
    productId !: string;

    @IsUUID()
    itemId !: string;
    
    @IsInt()
    @Min(1)
    quantity !: number;

}