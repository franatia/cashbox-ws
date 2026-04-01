import { IsUUID } from "class-validator";
import { NodeDto } from "./node.dto";

export class CreateNodeDto extends NodeDto {

    @IsUUID()
    projectId !: string;

}