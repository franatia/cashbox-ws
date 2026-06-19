import {BaseService} from "@/common/models/crud/base-service.crud";
import MovementsLinkerQuery from "./movements-linker.query";
import { CreateParams } from "./types/params/service.params";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MovementsLinkerService implements BaseService {

    constructor(
        private readonly query : MovementsLinkerQuery
    ){}

    /**
     * 
     * @param params 
     * @returns 
     */

    create(
        params : CreateParams
    ){

        return this.query.saveOne(params);

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    createMany(
        params : CreateParams[]
    ){

        return this.query.saveMany(
            params
        );

    }

}