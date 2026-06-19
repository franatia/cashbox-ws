import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import Constant from "../entities/constant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { OrmParams, SaveParams, UpdateParams } from "./types/params/query.params";

@Injectable()
export default class ConstantQuery extends BaseQuery<Constant> {

    constructor(
        @InjectRepository(Constant)
        repo : Repository<Constant>
    ){
        super(Constant, repo);
    }
    
    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    async saveOne(
        params : SaveParams
    ){
        const orm = this.makeOrm(params);
        const raw = await this.save(orm);

        return (raw.length) ? raw[0] : {};
    }

    /**
     * 
     * UPDATERS
     * 
     */

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    async updateOne(
        id : string,
        params : UpdateParams
    ){

        return this.resolveUpdate(
            {id},
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

    async deleteOne(
        id : string
    ){
        await this.delete({id});
    
        return {
            deletedConstant : id
        }
    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    makeOrm(params: OrmParams): DeepPartial<Constant> {
        const { 
            projectId,
            ...rest
        } = params;

        const orm : DeepPartial<Constant> = {
            ...rest
        }

        if(projectId){
            orm.project = {
                id : projectId
            }
        }

        return orm;

    }

}