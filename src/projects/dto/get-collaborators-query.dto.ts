import { AtLeastOne } from "@/common/decorators/validator/class-validator.decorator";
import { IsOptional, IsUUID } from "class-validator";

export default class GetCollaboratorsQueryDto {

    @IsOptional()
    @IsUUID()
    projectId !: string | undefined;

    @IsOptional()
    @IsUUID()
    nodeId !: string | undefined;

    @AtLeastOne(['projectId', 'nodeId'], {
        message: 'projectId or nodeId is required',
    })
    dummyProperty?: any;

}