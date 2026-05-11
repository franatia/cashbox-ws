import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, Min } from "class-validator";

export default class UpdateDto {

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    quantity ?: number;

}