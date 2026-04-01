import { AuthStage } from "@/auth/enums/auth-stage.enum";

export default interface JwtAuthEmailPayload {
    stage: AuthStage.authEmail,
    email: string,
    isValid: boolean
}