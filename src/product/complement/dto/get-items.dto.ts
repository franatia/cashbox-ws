import { Type } from "class-transformer";
import { IsInt, IsOptional, IsUUID, Min } from "class-validator";

export default class GetItemsDto {
    
    @IsOptional()
    @IsUUID()
    complementId ?: string;

    @IsOptional()
    @IsUUID()
    productItemId ?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    skip: number = 0;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    take: number = 4;

}