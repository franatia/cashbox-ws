import { ClsKeys } from "@/common/enum/cls/cls.enum";
import { ClsService } from "nestjs-cls";
import JwtRefreshPayload from "./interfaces/jwt-refresh-payload.interface";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class AuthContext {

    constructor(
        private readonly cls : ClsService
    ){}

    get user(){
        const currentUser = this.cls.get<JwtRefreshPayload>(ClsKeys.USER_TOKEN)
        
        if(!currentUser){
            throw new BadRequestException("Auth user not exists");
        }

        return currentUser;

    }

    get userContext(){

        const user = this.user;

        if(!user.context){
            throw new BadRequestException(
                "Auth user context does not exists"
            );
        }

        return user.context;

    }

    get userProject(){
        const context = this.userContext;

        if(!context.projectId){
            throw new BadRequestException(
                "Auth user has not a linked project"
            )
        }

        return context.projectId;

    }

    get userNode(){
        const context = this.userContext;

        if(!context.nodeId){
            throw new BadRequestException(
                "Auth user has not a linked node"
            )
        }

        return context.nodeId;
    }

    get userClient(){
        const user = this.user;

        if(!user.sub){
            throw new BadRequestException(
                "User client is required"
            )
        }

        return user.sub;

    }

}