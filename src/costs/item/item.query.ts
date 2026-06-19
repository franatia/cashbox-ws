import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { Item } from "../entities/item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";import { OrmParams, SaveParams, UpdateParams } from "./types/params/query.types";
import { Injectable } from "@nestjs/common";
import RuleQuery from "../rule/query/rule.query";

@Injectable()
export default class ItemQuery extends BaseQuery<Item> {

    constructor(
        @InjectRepository(Item)
        repo : Repository<Item>,

        private readonly ruleQuery : RuleQuery
    ){
        super(
            Item,
            repo
        )
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

        const {
            rulesId,
            ...rest
        } = params;

        const orm = this.makeOrm(rest);
        const raw = await this.save(orm);
        const entity = raw[0];

        if(rulesId?.length){
            await Promise.all(
                rulesId.map(ruleId => (
                    this.ruleQuery.addItems(
                        ruleId,
                        [entity.id]
                    )
                ))
            )
        }

        return entity;

    }

    /**
     * 
     * UPDATE
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

        return this.resolveUpdate({id}, params);
        
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
            deletedItem : id
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
     */

    makeOrm(params: OrmParams): DeepPartial<Item> {
        
        const {
            constantId,
            costId,
            taxId,
            ...rest
        } = params;

        const orm : DeepPartial<Item> = {
            ...rest
        };

        if(costId){

            orm.cost = {
                id : costId
            };

        }

        if(constantId){
            orm.constant = {
                id : constantId
            }
        }

        if(taxId){
            orm.tax = {
                id : taxId
            }
        }

        return orm;

    }

}