import { IsOptional, IsUUID } from "class-validator";
import { GetProjectQueryDto } from "./get-project-query.dto";

export default class GetProjectsQueryDto extends GetProjectQueryDto {

    @IsOptional()
    @IsUUID()
    nodeSelector !: string | undefined;

}