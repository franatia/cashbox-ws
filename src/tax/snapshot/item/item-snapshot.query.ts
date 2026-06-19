import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { TaxItemSnapshot } from "@/tax/entities/snapshot/snapshot-item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrmParams, SaveParams } from "./types/param/query.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ItemSnapshotQuery extends BaseQuery<TaxItemSnapshot>{

    constructor(
        @InjectRepository(TaxItemSnapshot)
        repo : Repository<TaxItemSnapshot>
    ){
        super(
            TaxItemSnapshot,
            repo
        )
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

    saveOne(
        params : SaveParams
    ){

        return this.resolveSaveOne(
            params
        );

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

    makeOrm(
        params: OrmParams
    ): DeepPartial<TaxItemSnapshot> {
        
        this.notEmptyParams(params);

        const {
            snapshotId,
            ...rest
        } = params; 

        const orm : DeepPartial<TaxItemSnapshot> = {
            ...rest
        };

        if(snapshotId){
            orm.snapshot = {
                id : snapshotId
            }
        }

        return orm;

    }

}