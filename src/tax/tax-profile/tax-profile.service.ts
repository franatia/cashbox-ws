import {BaseService} from "@/common/models/crud/base-service.crud";
import TaxProfileQuery from "./tax-profile.query";
import { BadRequestException, Injectable } from "@nestjs/common";

type CreateParams = {
    projectId : string
}

@Injectable()
export default class TaxProfileService implements BaseService {
    
    constructor(
        private readonly query : TaxProfileQuery
    ){}
    
    /**
     * 
     * HELPERS
     * 
     */

    async notExistsByProject(
        projectId : string
    ){

        const exists = await this.query.exists({
            project : {
                id : projectId
            }
        })

        if(exists){
            throw new BadRequestException("Tax profile alredy exists with this user id");
        }

    }

    /**
     * 
     * CREATORS
     * 
     */

    /**
     * 
     * @param params 
     * 
     */

    async create(
        params : CreateParams
    ){
        const {
            projectId
        } = params;

        await this.notExistsByProject(projectId);

        return this.query.saveOne(params);
    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param id 
     */

    delete(
        id : string
    ) {
        return this.query.deleteOne(id);
    }
}