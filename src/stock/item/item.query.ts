import { InjectRepository } from "@nestjs/typeorm";
import {Item} from "../entities/item.entity";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { OrmParams, SaveParams, UpdateParams } from "./types/params/query.params";
import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ItemQuery extends BaseQuery<Item> {
    
    constructor(
        @InjectRepository(Item)
        repo : Repository<Item>
    ){
        super(Item, repo);
    }

    /**
     * 
     * FINDERS
     * 
     */

    /**
     * 
     * @param where 
     * @returns 
     */

    async findAndGetId(
        where : FindOptionsWhere<Item>
    ){

        const {id} = await this.findOneOrFail({
            where,
            select : {
                id : true
            }
        });

        return id;

    }

    /**
     * 
     * @param lotId 
     * @returns 
     */

    findByLotId(
        lotId : string
    ){

        return this.findOneOrFail({
            where : {
                lots : {
                    id : lotId
                }
            }
        });

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

    saveOne(
        params : SaveParams
    ){
        return this.resolveSaveOne(params);
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    saveMany(
        params : SaveParams[]
    ){
        return this.resolveSaveMany(params);
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
    updateOne(
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
    deleteOne(
        id : string
    ){
        return this.delete({id});
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    makeOrm(
        params : OrmParams
    ){
        const {
            nodeId,
            stockId,
            ...rest
        } = params;

        const orm : DeepPartial<Item> = {
            ...rest
        };

        if(nodeId){
            orm.node = {
                id : nodeId
            }
        }

        if(stockId){
            orm.stock = {
                id : stockId
            }
        }

        return orm;

    }

}