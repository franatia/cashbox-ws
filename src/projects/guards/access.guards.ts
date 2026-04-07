import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ProjectService } from "../project.service";

@Injectable()
export class ProjectAdminAccessGuard implements CanActivate {
    
    constructor(
        private readonly projectService : ProjectService
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
        const request = context.switchToHttp().getRequest();
        const clientId = request.user;

        return true;

    }

}