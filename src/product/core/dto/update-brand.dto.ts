import { IsOptional, IsUUID } from "class-validator";

export default class UpdateBrandDto {
    
    @IsOptional()
    @IsUUID()
    brandId !: string;

}