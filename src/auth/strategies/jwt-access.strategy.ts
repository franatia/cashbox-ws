import { JwtTypes } from "@/common/constants/jwt-types.enum";
import AuthConfig from "@/config/interfaces/auth.config.interface";
import { GoneException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities";
import { AuthStage } from "@/auth/enums/auth-stage.enum";
import { JwtAccessPayload } from "../interfaces/jwt-access-payload.interface";
import { AuthService } from "../auth.service";

@Injectable()
export default class JwtAccessStrategy extends PassportStrategy(Strategy, JwtTypes.jwtAccess) {

    constructor(

        private readonly authService: AuthService,

        configService: ConfigService

    ) {

        const authConfig = configService.get<AuthConfig>("auth")!;

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: authConfig.jwtSecret
        })
    }

    async validate(payload: JwtAccessPayload): Promise<User> {

        const {sub: id, stage} = payload;

        if (stage !== AuthStage.access) throw new UnauthorizedException("Token is invalid");

        const user = await this.authService.findUser({
            id,
        }, {
            select:{
                password: true
            }
        })

        if (!user) throw new GoneException("User does not exists");

        return user;
    }

}