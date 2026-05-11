import { BadRequestException, ExecutionContext } from "@nestjs/common";
import { AccessConfigMetadata } from "../decorators/access.decorator";
import { extractFromRequestByPath } from "./request";
import JwtRefreshPayload from "@/auth/interfaces/jwt-refresh-payload.interface";

export const policieValidator = async (
    config: AccessConfigMetadata,
    payload: any,
    path: string,
    cb: (value: any[]) => Promise<boolean>
) => {

    const { freeNull = false, firstMatch = false } = config;
    const isOptional = freeNull || firstMatch

    const softPath = `${path}${isOptional ? "?" : ""}`

    const values = extractFromRequestByPath(payload, softPath);
    const isEmpty = !values.length;

    if (isEmpty) {

        if (isOptional) return false;

        throw new BadRequestException(`Missing required path "${path}" in request`)
    }

    return cb(values);

}

export const getPayload = (ctx: ExecutionContext): JwtRefreshPayload => {
    const request = ctx.switchToHttp().getRequest();
    const payload = request.user;

    if (!payload || !Object.entries(payload).length) {
        throw new BadRequestException("Client payload is required");
    };

    return request.user;
}