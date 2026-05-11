import { IsOptional, IsUUID } from "class-validator";

export default class GetCollaboratorsDto {
    @IsOptional()
    @IsUUID()
    nodeSelector ?: string;
}