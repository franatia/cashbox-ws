import { JwtTypes } from "@/common/enum/token/jwt-types.enum";
import { BadRequestException, CanActivate, ExecutionContext, GoneException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities";
import { Repository } from "typeorm";

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

        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        console.log("Guard", user);

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
export class JwtRefreshGuard extends AuthGuard(JwtTypes.jwtRefresh) {
    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        
        if (err || !user) {
            throw err || new UnauthorizedException("Invalid token");
        }

        return user;
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

        const exists = await this.userRepo.exists({
            where: {
                email,
                ...(user && ({id : user.sub}))
            }
        })

        if (!exists) throw new BadRequestException("Credentials are not valid");

        return true;

    }
}