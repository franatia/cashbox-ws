import { JwtTypes } from "@/common/constants/jwt-types.enum";
import Configuration from "@/config/interfaces/configuration.interface";
import { GoneException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import JwtAuthPayload from "../interfaces/jwt-auth-payload.interface";
import { AuthStage } from "@/auth/enums/auth-stage.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities";
import { Repository } from "typeorm";
import { AuthService } from "../auth.service";

@Injectable()
export default class JwtAuthStrategy extends PassportStrategy(Strategy, JwtTypes.jwtAuth) {

    constructor(

        private readonly authService: AuthService,

        configService: ConfigService
    ) {

        const authConfig = configService.get<Configuration["auth"]>("auth")!

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: authConfig.jwtSecret
        })
    }


    async validate(payload: JwtAuthPayload): Promise<JwtAuthPayload> {

        const { sub: id, stage } = payload;

        if (stage !== AuthStage.auth) throw new UnauthorizedException("Invalid token");

        const isExists = await this.authService.existsUser(id);

        if (!isExists) throw new GoneException("User does not exists");

        return payload;

    }
}