import { Injectable } from "@nestjs/common";
import ConstantQuery from "./constant.query";
import {BaseService} from "@/common/models/crud/base-service.crud";
import { notObjectEmpty } from "@/common/helpers/object.helper";
import { CreateParams, PutParams } from "./types/params/service.params";

@Injectable()
export default class ConstantService implements BaseService {

    constructor(
        private readonly query : ConstantQuery
    ){}

    /**
     * 
     * CREATORS
     * 
     */

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
     * PUT
     * 
     */

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    put(
        id : string,
        params : PutParams
    ){

        notObjectEmpty(params);

        return this.query.updateOne(
            id,
            params
        )
    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param id 
     * @returns 
     */

    delete(
        id : string
    ){
        return this.query.deleteOne(
            id
        )
    }

}