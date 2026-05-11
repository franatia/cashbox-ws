import { JwtTypes } from "@/common/constants/jwt-types.enum";
import AuthConfig from "@/config/interfaces/auth.config.interface";
import { BadRequestException, GoneException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthStage } from "@/auth/enums/auth-stage.enum";
import JwtRefreshPayload from "../interfaces/jwt-refresh-payload.interface";
import { AuthService } from "../auth.service";

@Injectable()
export default class JwtRefreshStrategy extends PassportStrategy(Strategy, JwtTypes.jwtRefresh) {

    constructor(

        private readonly authService : AuthService,
        configService: ConfigService

    ) {

        const authConfig = configService.get<AuthConfig>("auth")!;

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.headers["x-refresh-token"] || null,
            ]),
            secretOrKey: authConfig.jwtSecret
        })
    }

    async validate(payload: JwtRefreshPayload): Promise<JwtRefreshPayload> {

        const { sub : id, stage } = payload;

        if (stage !== AuthStage.logged) throw new UnauthorizedException("Token is invalid");

        const exists = this.authService.existsUser(id);

        if(!exists) throw new GoneException("User does not exists");

        return payload;
    }

}