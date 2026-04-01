import { CanActivate, ConflictException, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities";
import { Repository } from "typeorm";
import SendEmailDto from "../dto/send-email.dto";

@Injectable()
export class VerifyEmailGuard implements CanActivate {

    constructor(

        @InjectRepository(User)
        private readonly userRepo: Repository<User>

    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const {body} = context.switchToHttp().getRequest<{body: SendEmailDto}>();
        const {email} = body;

        const isExists = await this.userRepo.exists({
            where: {
                email
            }
        });

        if(isExists) throw new ConflictException("Email is already register");

        return true;
    }
    
}