import { IsOptional, IsUUID } from "class-validator";

export default class DeleteCollaboratorDto {

    @IsOptional()
    @IsUUID()
    projectId !: string | undefined;

    @IsOptional()
    @IsUUID()
    nodeId !: string | undefined

}