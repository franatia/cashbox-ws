import { AuthStage } from "@/auth/enums/auth-stage.enum";

export default interface JwtRefreshPayload{
    sub: string,
    stage: AuthStage.logged
}