import { CanActivate, ExecutionContext, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AccessService } from "../access.service";
import { ACCESS_CONFIG, AccessConfigMetadata } from "@/access/decorators/access.decorator";
import { IS_PUBLIC_KEY } from "@/common/decorators/public.decorator";

/**
 * 
 * Checkea los permisos del cliente.
 * 1. Si colocamos byNode y byProject en true al mismo tiempo,
 *    byNode tiene prioridad
 * 
 */

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly accessService: AccessService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if(isPublic) return true;
        
        const config = this.reflector.getAllAndOverride<AccessConfigMetadata>(
            ACCESS_CONFIG,
            [context.getHandler(), context.getClass()],
        ) ?? {};

        const policies = this.reflector.getAllAndOverride<Function[]>(
            "access-policies",
            [context.getHandler(), context.getClass()],
        ) ?? [];

        const {firstMatch = false} = config;

        for(const policy of policies){
            try {
                await policy(context, this.accessService, config);
                if(firstMatch) return true;
            } catch (error) {
                if(firstMatch) continue;
                throw error;
            }
        }

        return true;

    }

}