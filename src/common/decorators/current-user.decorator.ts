import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (_: any, ctx: ExecutionContext) => {
        const {user} = ctx.switchToHttp().getRequest();
        return user;
    }
)