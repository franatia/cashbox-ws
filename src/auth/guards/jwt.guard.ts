import { JwtTypes } from "@/common/constants/jwt-types.enum";
import { BadRequestException, CanActivate, ExecutionContext, GoneException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { GuardsConsumer } from "@nestjs/core/guards";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { User } from "../entities";
import { Repository } from "typeorm";
import { Reflector } from "@nestjs/core";
import { ref } from "process";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import Configuration from "@/config/interfaces/configuration.interface";
import JwtRefreshPayload from "../interfaces/jwt-refresh-payload.interface";
import { AuthStage } from "../enums/auth-stage.enum";

@Injectable()
export class JwtAuthEmailGuard extends AuthGuard(JwtTypes.jwtAuthEmail) {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
        if (err || !user) {
            throw err || new UnauthorizedException("Invalid token");
        }

        return user;
    }
}

@Injectable()
export class JwtAccessGuard extends AuthGuard(JwtTypes.jwtAccess) {

    handleRequest(err: any, user: any, info: any, ctx: ExecutionContext, status?: any) {

        if (!user) return null;

        if (err) throw err;

        return user;
    }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard(JwtTypes.jwtAuth) {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {

        if (err || !user) {
            throw err || new UnauthorizedException("Invalid token");
        }

        return user;
    }
}

@Injectable()
export class JwtRefreshGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride(
            IS_PUBLIC_KEY,
            [
                ctx.getHandler(),
                ctx.getClass()
            ]
        )

        if (isPublic) return true;

        const request = ctx.switchToHttp().getRequest();

        const token = request.headers["x-refresh-token"];

        if (!token) throw new UnauthorizedException("Invalid token");

        try {

            const secret = this.configService.get<Configuration["auth"]>("auth")?.jwtSecret;

            if (!secret) throw new InternalServerErrorException();

            const { sub, stage } = await this.jwtService.verifyAsync<JwtRefreshPayload>(token, {
                secret
            });

            if (stage !== AuthStage.logged) throw new UnauthorizedException("Invalid token");

            const isUserExists = await this.userRepo.exists({
                where: {
                    id: sub
                }
            })

            if (!isUserExists) throw new UnauthorizedException("Invalid token");

            request.user = sub;

        } catch (e) {
            throw new UnauthorizedException("Invalid token");
        }

        return true;

    }
}

@Injectable()
export class LogInGuard implements CanActivate {

    constructor(

        @InjectRepository(User)
        private readonly userRepo: Repository<User>

    ) { }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {

        const request = ctx.switchToHttp().getRequest();
        let user = request.user;
        const body = request.body;
        const email = body.email;

        if (user && user.email !== email) {
            request.user = null;
            user = null;
        }

        if (!user) {
            const exists = await this.userRepo.exists({
                where: {
                    email
                }
            })

            if (!exists) throw new BadRequestException("Credentials are not valid");
        }

        return true;
    }
}