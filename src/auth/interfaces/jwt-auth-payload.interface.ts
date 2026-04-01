import { AuthStage } from "@/auth/enums/auth-stage.enum";

export default interface JwtAuthPayload {

    sub: string,
    stage: AuthStage.auth

}