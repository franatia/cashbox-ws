import { BadRequestException, Injectable } from "@nestjs/common";
import ConstantQuery from "./constant.query";

@Injectable()
export class ConstantRelations {
    constructor(
        private readonly query : ConstantQuery
    ){}

    /**
     * 
     * LINKERS
     * 
     */


    async linkedToProject(
        id : string,
        projectId : string,
        throwable : boolean = true
    ){

        const exists = await this.query.exists({
            id,
            project : {
                id : projectId
            }
        })

        if(!exists && throwable){
            throw new BadRequestException("Constant is not linked with project");
        }

        return exists;

    }

}