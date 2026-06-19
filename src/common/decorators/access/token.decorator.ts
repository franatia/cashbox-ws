import JwtRefreshPayload from "@/auth/interfaces/jwt-refresh-payload.interface";
import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { TokenDecoratorOptions } from "./types/token.types";
import { isObject } from "class-validator";

type TokenPayload = {
    user: JwtRefreshPayload
}

const existsUserKey = (
    request: any
) => {

    const includesUser = Object.keys(request).includes("user");

    if (!includesUser) {
        throw new BadRequestException("User key does not exists in request");
    }

}

const getUser = (
    ctx: ExecutionContext
) => {
    const request = ctx.switchToHttp().getRequest<Request & TokenPayload>();
    existsUserKey(
        request
    );

    return request.user;
}

const getSub = (
    user: JwtRefreshPayload,
    options ?: TokenDecoratorOptions
) => {
    if (!user.sub && !options?.optional) {
        throw new BadRequestException("Sub is empty");
    }

    return user.sub;
}

const getContext = (
    user : JwtRefreshPayload,
    options ?: TokenDecoratorOptions
) => {
    if(
        (!user.context || !Object.entries(user.context).length) &&
        !options?.optional
    ){
        throw new BadRequestException("User context is empty inside token payload");
    }

    return user.context;
}

const getProjectId = (
    user : JwtRefreshPayload,
    options ?: TokenDecoratorOptions
) => {
    const context = getContext(user);

    if(
        !context?.projectId &&
        !options?.optional
    ){
        throw new BadRequestException("Project id is empty inside token payload's conext");
    }

    return context?.projectId;
}

const getNodeId = (
    user : JwtRefreshPayload,
    options ?: TokenDecoratorOptions
) => {
    const context = getContext(user);
    
    if(
        !context?.nodeId &&
        !options?.optional
    ){
        throw new BadRequestException("Node id is empty inside token payload's context");
    }

    return context?.nodeId;
}

export const CurrentSub = createParamDecorator(
    (_: any, ctx: ExecutionContext) => {

        const user = getUser(ctx);
        const sub = getSub(user);

        return sub;
    }
)

export const CurrentPayload = createParamDecorator(
    (_: any, ctx: ExecutionContext) => {

        const user = getUser(ctx);

        return user;
    }
)

export const CurrentProject = createParamDecorator(
    (options: TokenDecoratorOptions | undefined, ctx: ExecutionContext) => { 
        const user = getUser(ctx);
        const projectId = getProjectId(user, options);

        return projectId
    }
)

export const CurrentNode = createParamDecorator(
    (options: TokenDecoratorOptions | undefined, ctx: ExecutionContext) => {
        const user = getUser(ctx);
        const nodeId = getNodeId(user, options);

        return nodeId;
    }
)

export const CurrentNodeOrEmpty = createParamDecorator(
    (options: TokenDecoratorOptions | undefined, ctx: ExecutionContext) => {
        try{
            const user = getUser(ctx);
            const nodeId = getNodeId(user, options);

            return nodeId;
        }catch{
            return undefined;
        }
    }
)

export const CurrentContext = createParamDecorator(
    (options: TokenDecoratorOptions | undefined, ctx: ExecutionContext) => {
        const user = getUser(ctx);
        const context = getContext(user, options);

        return context;
    }
)