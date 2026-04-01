import { User } from "@/auth/entities";
import { generateHash, match } from "./hash.helper";
import { AuthStage } from "../../auth/enums/auth-stage.enum";
import { StringValue } from "ms";

export const generateEmailToken = () : string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const compareToken = ( token: string, hash: string) : Promise<boolean> => {
    return match(token, hash)
}

export const buildAuthPayloadByUser = (user: User | null) : {

    stage: AuthStage.logged | AuthStage.auth,
    expiresIn: StringValue,
    isAuth: boolean

} => {
    const isAuth = !!user;

    const stage = (isAuth) ? AuthStage.logged : AuthStage.auth;

    const expiresIn = (isAuth) ? "30d" : "15m";

    return {
        stage,
        expiresIn,
        isAuth
    }
}