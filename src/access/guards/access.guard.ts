import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AccessService } from "../access.service";
import { ACCESS_CONFIG_KEY, ACCESS_POLICIES_KEY, AccessConfigMetadata } from "@/access/decorators/access.decorator";
import { IS_PUBLIC_KEY } from "@/common/decorators/access/public.decorator";
import { AuthService } from "@/auth/auth.service";
import { HeaderKeys } from "@/common/enum/http/header-keys.enum";
import { ConfigService } from "@nestjs/config";
import Configuration from "@/config/interfaces/configuration.interface";
import { JwtService } from "@nestjs/jwt";
import JwtRefreshPayload from "@/auth/interfaces/jwt-refresh-payload.interface";
import { AuthStage } from "@/auth/enums/auth-stage.enum";
import { Policie } from "../policies/policie";
import { Class } from "@/common/types/abstract/class.type";
import { AUTH_TYPE_KEY } from "@/auth/decorators/auth.decorator";
import { AuthType } from "@/auth/enums/auth-type.enum";

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

        private readonly accessService: AccessService,
    ) { }

    private getMetadata<T>(
        metadataKey: string,
        context: ExecutionContext
    ): T {
        return this.reflector.getAllAndOverride<T>(
            metadataKey,
            [context.getHandler(), context.getClass()]
        )
    }

    private skip(
        context: ExecutionContext
    ) {

        const authType = this.getMetadata<AuthType>(
            AUTH_TYPE_KEY,
            context
        );

        const skip = authType !== undefined && authType !== AuthType.REFRESH;

        return skip;
    }

    private getConfig(
        context: ExecutionContext
    ): AccessConfigMetadata {
        return this.getMetadata<AccessConfigMetadata>(
            ACCESS_CONFIG_KEY,
            context
        ) ?? {}
    }

    private getPolicies(
        context: ExecutionContext
    ): Class<Policie>[] {
        return this.getMetadata<Class<Policie>[]>(
            ACCESS_POLICIES_KEY,
            context
        ) ?? []
    }

    private async runPolicies(
        context: ExecutionContext
    ) {

        const policies = this.getPolicies(context);
        const config = this.getConfig(context);

        const { firstMatch = false } = config;

        for (let i = 0; i < policies.length; i++) {

            const policie = policies[i];
            const isLast = i === policies.length - 1;

            const instance = new policie();
            const verified = await instance.run(
                context, 
                this.accessService, 
                config
            );

            if (firstMatch && verified) break;

            if (firstMatch && isLast) {
                throw new ForbiddenException("Nothing was verified");
            }
        }


    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const skip = this.skip(context);
        if (skip) return true;

        await this.runPolicies(context);

        return true;

    }

}