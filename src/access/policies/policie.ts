import { BadRequestException, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AccessService } from "../access.service";
import { AccessConfigMetadata } from "../decorators/access.decorator";
import JwtRefreshPayload from "@/auth/interfaces/jwt-refresh-payload.interface";
import { plainRequest } from "@/common/helpers/request.helper";

export type PoliciePayload = {
    token : JwtRefreshPayload,
    request : any
}

export abstract class Policie {
    
    abstract verify(
        payload : PoliciePayload,
        accessService: AccessService,
        accessConfig: AccessConfigMetadata
    ): Promise<boolean>;

    private plainRequest(
        request : any
    ){
        return plainRequest(request);
    }

    private getPayload(
        ctx : ExecutionContext
    ) : PoliciePayload {
        const request = ctx.switchToHttp().getRequest();
        const tokenPayload = request.user;

        if(!tokenPayload || !Object.entries(tokenPayload).length){
            throw new UnauthorizedException("Payload is required");
        }

        return {
            token : tokenPayload,
            request : this.plainRequest(request)
        }
    }

    async run(
        ctx: ExecutionContext,
        accessService: AccessService,
        accessConfig: AccessConfigMetadata
    ) : Promise<Boolean> {

        const payload = this.getPayload(ctx);
        return this.verify(
            payload,
            accessService,
            accessConfig
        )

    }

}