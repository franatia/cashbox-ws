import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { CollaboratorRole } from "../entities/collaborator.entity";

export default class UpdateCollaboratorDto {
    
    @IsOptional()
    @IsUUID()
    nodeId !: string;

    @IsOptional()
    @IsUUID()
    projectId !: string;
    
    @IsEnum(CollaboratorRole)
    role !: CollaboratorRole;
    
}