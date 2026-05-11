import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { CollaboratorRole } from "../entities/collaborator.entity";

export default class CreateCollaboratorDto {

    @IsUUID()
    userId !: string;

    @IsEnum(CollaboratorRole)
    role !: CollaboratorRole;

    @IsOptional()
    @IsUUID()
    nodeId ?: string;
   
}