import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsUUID } from "class-validator";

export class GetProjectQueryDto {

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    selectNodes !: boolean;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    selectCollaborators !: boolean;
}