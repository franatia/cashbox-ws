import { CanActivate, ConflictException, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities";
import { Repository } from "typeorm";
import SendEmailDto from "../dto/send-email.dto";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { AuthType } from "../enums/auth-type.enum";
import { JwtAccessGuard, JwtAuthEmailGuard, JwtAuthGuard, JwtRefreshGuard } from "./jwt.guard";
import { AUTH_TYPE_KEY } from "../decorators/auth.decorator";

@Injectable()
export class VerifyEmailGuard implements CanActivate {

    constructor(

        @InjectRepository(User)
        private readonly userRepo: Repository<User>

    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const {body} = context.switchToHttp().getRequest<{body: SendEmailDto}>();
        const {email} = body;

        const isExists = await this.userRepo.exists({
            where: {
                email
            }
        });

        if(isExists) throw new ConflictException("Email is already register");

        return true;
    }
    
}

@Injectable()
export class AuthManagerGuard implements CanActivate {
    
    constructor(
        private readonly reflector : Reflector,
        private readonly authEmailGuard : JwtAuthEmailGuard,
        private readonly authGuard : JwtAuthGuard,
        private readonly accessGuard : JwtAccessGuard,
        private readonly refreshGuard : JwtRefreshGuard
    ){}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const authType = this.reflector.getAllAndOverride<AuthType>(
            AUTH_TYPE_KEY,
            [context.getHandler(), context.getClass()]
      ) || AuthType.REFRESH;

      switch(authType){
        case AuthType.PUBLIC:
            return true;
        case AuthType.AUTH_EMAIL:
            return this.authEmailGuard.canActivate(context);
        case AuthType.ACCESS:
            return this.accessGuard.canActivate(context);
        case AuthType.AUTH:
            return this.authGuard.canActivate(context);
        case AuthType.REFRESH:
        case AuthType.OFF_PROJECT_CONTEXT:
            return this.refreshGuard.canActivate(context);
        default:
            return false;
      }

    }
}