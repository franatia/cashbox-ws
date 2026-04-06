import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { CollaboratorRole } from "../entities/collaborator.entity";

export default class CreateCollaboratorDto {

    @IsUUID()
    user !: string;

    @IsUUID()
    projectId !: string;

    @IsUUID()
    @IsOptional()
    nodeId !: string | undefined;

    @IsEnum(CollaboratorRole)
    role !: CollaboratorRole;
   
}