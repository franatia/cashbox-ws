import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import CostItemSnapshot from "@/costs/entities/snapshot/item-snapshot.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrmParams, SaveParams } from "./types/params/query.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ItemSnapshotQuery extends BaseQuery<CostItemSnapshot>{

    constructor(
        @InjectRepository(CostItemSnapshot)
        repo : Repository<CostItemSnapshot>
    ){
        super(CostItemSnapshot, repo);
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    saveOne(
        params : SaveParams
    ){
        return this.resolveSaveOne(
            params
        );
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    saveMany(
        params : SaveParams[]
    ){
        return this.resolveSaveMany(
            params
        );
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    makeOrm(params: OrmParams): DeepPartial<CostItemSnapshot> {
        
        this.notEmptyParams(params);

        const {
            costSnapshotId,
            ...rest
        } = params;

        const orm : DeepPartial<CostItemSnapshot> = {
            ...rest
        }

        if(costSnapshotId){
            orm.costSnapshot = {
                id : costSnapshotId
            }
        }

        return orm;

    }

}