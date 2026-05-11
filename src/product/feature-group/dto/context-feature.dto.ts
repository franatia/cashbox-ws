import { IsBoolean, IsInt, IsOptional, IsUUID } from "class-validator";

export class ContextFeatureDto {
    @IsUUID()
    id !: string;

    @IsInt()
    level !: number;

    @IsOptional()
    @IsBoolean()
    main?: boolean;
}