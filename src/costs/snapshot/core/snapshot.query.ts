import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import CostSnapshot from "@/costs/entities/snapshot/snapshot.entity";import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrmParams, SaveParams, UpdateParams } from "./types/params/query.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SnapshotQuery extends BaseQuery<CostSnapshot> {

    constructor(
        @InjectRepository(CostSnapshot)
        repo : Repository<CostSnapshot>
    ){
        super(CostSnapshot, repo);
    }
    
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
     * UPDATERS
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
        );

    }

    /**
     * 
     * @param id 
     * @param taxSnapshotId 
     * @returns 
     */

    updateTaxSnapshotId(
        id : string,
        taxSnapshotId : string
    ){
        return this.resolveUpdate(
            {id},
            {
                taxSnapshotId
            }
        )
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    makeOrm(params: OrmParams): DeepPartial<CostSnapshot> {
        
        this.notEmptyParams(params);

        const {
            taxSnapshotId,
            itemsId,
            ...rest
        } = params;

        const orm : DeepPartial<CostSnapshot> = {
            ...rest
        };

        if(taxSnapshotId){
            orm.taxSnapshot = {
                id : taxSnapshotId
            }
        }

        if(itemsId) {
            orm.items = itemsId.map(id => ({id}));
        }

        return orm;

    }

}