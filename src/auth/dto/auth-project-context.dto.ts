import { IsUUID } from "class-validator";

export default class AuthProjectContextDto{

    @IsUUID()
    projectId !: string;

    @IsUUID()
    nodeId ?: string;

}