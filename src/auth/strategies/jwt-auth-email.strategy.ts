import Configuration from "@/config/interfaces/configuration.interface";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import JwtAccessPayload from "../interfaces/jwt-auth-email-payload.interface";
import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { isEmail } from "class-validator";
import { AuthStage } from "@/auth/enums/auth-stage.enum";
import { JwtTypes } from "@/common/constants/jwt-types.enum";

@Injectable()
export default class JwtAuthEmailStrategy extends PassportStrategy(Strategy, JwtTypes.jwtAuthEmail) {
    constructor(
        configService: ConfigService
    ) {

        const authConfig = configService.get<Configuration["auth"]>("auth")!

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: authConfig.jwtSecret
        })
    }

    private handleHttpException(ClassExcpetion: new (...args: any[]) => HttpException, msg: string) {
        throw new ClassExcpetion(msg);
    }

    validate(payload: JwtAccessPayload) : JwtAccessPayload {

        const msgException = "Token is invalid";

        const handleUnauthorizedException = () => {
            this.handleHttpException(UnauthorizedException, msgException);
        }

        if (!payload.isValid) handleUnauthorizedException();

        if (!isEmail(payload.email)) handleUnauthorizedException();

        if (payload.stage !== AuthStage.authEmail) handleUnauthorizedException();

        return payload;

    }
}