import { IsEnum, IsOptional, IsUUID, ValidateIf } from "class-validator";
import { CollaboratorRole } from "../entities/collaborator.entity";

export default class UpdateCollaboratorDto {
    
    @ValidateIf(o => !o.projectId)
    @IsOptional()
    @IsUUID()
    nodeId !: string;

    @ValidateIf(o => !o.nodeId)
    @IsOptional()
    @IsUUID()
    projectId !: string;
    
    @IsEnum(CollaboratorRole)
    role !: CollaboratorRole;
    
}