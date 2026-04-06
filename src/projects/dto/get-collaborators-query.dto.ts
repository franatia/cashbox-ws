import { IsOptional, IsUUID } from "class-validator";

export default class GetCollaboratorsQueryDto {

    @IsOptional()
    @IsUUID()
    projectSelector !: string | undefined;
    
    @IsOptional()
    @IsUUID()
    nodeSelector !: string | undefined;

}