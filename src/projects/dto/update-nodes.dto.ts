import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { CreateNodesDto } from "./create-nodes.dto";
import { Type } from "class-transformer";
import { StrictNodeDto } from "./strict-node.dto";

export class UpdateNodesDto extends CreateNodesDto {

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => StrictNodeDto)
    declare nodes : StrictNodeDto[];

};