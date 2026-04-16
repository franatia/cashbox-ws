import { AccessService } from "@/access/access.service";
import { AccessConfigMetadata } from "@/access/decorators/access.decorator";
import { extractFromRequest } from "@/access/helpers/request";
import { BadRequestException, ExecutionContext } from "@nestjs/common";

export const ProjectAdminPolicie = async (
    ctx: ExecutionContext,
    accessService: AccessService,
    accessConfig : AccessConfigMetadata
) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    const {freeNull = false, wholeProject = true} = accessConfig;

    const projectId = extractFromRequest(request, "projectId");

    if(!projectId && !freeNull) throw new BadRequestException("projectId is required");

    if(projectId){
        await accessService.hasProjectAdminAccess(
            projectId, 
            user,
            wholeProject
        );
    }

}