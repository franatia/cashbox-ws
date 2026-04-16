import { Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export default class GetNodeQueryDto {

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    selectProject !: boolean;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    selectCollaborators !: boolean;


}
