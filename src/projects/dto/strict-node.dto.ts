import { IsUUID } from "class-validator";
import { NodeDto } from "./node.dto";

export class StrictNodeDto extends NodeDto {

    @IsUUID()
    id!: string;

}