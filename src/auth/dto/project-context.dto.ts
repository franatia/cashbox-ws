import { IsOptional, IsUUID } from "class-validator";

export default class ProjectContextDto {
    
    @IsUUID()
    projectId !: string;

    @IsOptional()
    @IsUUID()
    nodeId ?: string;
    
}