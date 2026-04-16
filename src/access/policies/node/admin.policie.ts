import { AccessService } from "@/access/access.service";
import { AccessConfigMetadata } from "@/access/decorators/access.decorator";
import { extractFromRequest } from "@/access/helpers/request";
import { BadRequestException, ExecutionContext } from "@nestjs/common";

export const NodeAdminPolicie = async (
    ctx: ExecutionContext,
    accessService: AccessService,
    accessConfig : AccessConfigMetadata
) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    const {freeNull = false} = accessConfig;

    const nodeId = extractFromRequest(request, "nodeId");

    if(!nodeId && !freeNull) throw new BadRequestException("nodeId is required");

    if(nodeId){
        await accessService.hasNodeAdminAccess(
            nodeId, 
            user
        );
    }

}