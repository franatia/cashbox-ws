import { IsEnum, IsOptional, IsUUID, ValidateIf } from "class-validator";
import { CollaboratorRole } from "../entities/collaborator.entity";

export default class UpdateCollaboratorDto {
    
    @IsEnum(CollaboratorRole)
    role !: CollaboratorRole;
    
}