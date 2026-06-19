import { BadRequestException, Injectable } from "@nestjs/common";
import { CanCreateParams, NotDuplicateParams } from "./types/params/validator.param";
import { CollaboratorFinder } from "./query/collaborator.finder";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/auth/entities";
import { Repository } from "typeorm";

@Injectable()
export class CollaboratorValidator {

    constructor(
        private readonly finder : CollaboratorFinder,
    
        @InjectRepository(User)
        private readonly userRepo : Repository<User>
    ){}

    /**
     * 
     * @param params 
     * 
     */

    async ensureCanCreate(
        params : CanCreateParams
    ){

        const {
            userId,
            clientId
        } = params;

        if(clientId === userId){
            throw new BadRequestException(
                "User can not be equal to client"
            )
        }

        const isExists = await this.userRepo.exists({
           where : {
             id : userId
           }
        })

        if(!isExists){
            throw new BadRequestException(
                "User was not found"
            );
        }

        await this.ensureNotDuplicate(
            params
        );

    }

    /**
     * 
     * @param userId 
     */
    
    async ensureNotDuplicate(
        params : NotDuplicateParams
    ){

        const exists = await this.finder.existsByNullableContext(
            params
        );

        if(exists){
            throw new BadRequestException(
                "Collaborator is already exists"
            )
        };

    }

}