import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from "class-validator";
import { NodeDto } from "./node.dto";

export class CreateNodesDto {

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => NodeDto)
    nodes !: NodeDto[];

    @IsUUID()
    projectId !: string;

}