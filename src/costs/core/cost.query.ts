import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { Cost } from "../entities/cost.entity";
import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { OrmParams, SaveParams, UpdateParams } from "./types/params/query.params";

@Injectable()
export default class CostQuery extends BaseQuery<Cost> {

    constructor(
        @InjectRepository(Cost)
        repo : Repository<Cost>
    ){ 
        super(Cost, repo);
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
        return raw[0];        
    }

    /**
     * 
     * UPDATERS
     * 
     */

    async updateOne(
        id : string,
        params : UpdateParams
    ){
        return this.resolveUpdate({id}, params);
    }

    /**
     * 
     * DELETERS
     * 
     */

    async deleteOne(
        id : string
    ){
        await this.delete({id});
        return {
            deletedCost : id
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

    makeOrm(params: OrmParams): DeepPartial<Cost> {
        const {
            productItemsId,
            projectId,
            ...rest
        } = params;

        const orm : DeepPartial<Cost> = {
            ...rest
        }

        if(projectId){
            orm.project = {
                id : projectId
            }
        }

        if(productItemsId){

            orm.productItems = productItemsId.map(id => ({id}));

        }

        return orm;

    }

    setProductItems(
        id : string,
        itemsId : string[]
    ){
        return this.repo.createQueryBuilder()
            .relation(Cost, "productItems")
            .of(id)
            .set(itemsId);
    }

}