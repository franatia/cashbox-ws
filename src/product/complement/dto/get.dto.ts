import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsUUID, Min } from "class-validator";

export default class GetDto {

    @IsUUID()
    productId !: string;

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