import { AuthStage } from "@/auth/enums/auth-stage.enum";

export interface JwtAccessPayload {
    sub: string,
    stage: AuthStage.access
}