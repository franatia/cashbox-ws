import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { TaxSnapshot } from "@/tax/entities/snapshot/snapshot.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrmParams, SaveParams } from "./types/param/query.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SnapshotQuery extends BaseQuery<TaxSnapshot> {

    constructor(
        @InjectRepository(TaxSnapshot)
        repo : Repository<TaxSnapshot>
    ){
        super(TaxSnapshot, repo);
    }

    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * @param param 
     * @returns 
     */

    saveOne(
        param : SaveParams
    ){
        return this.resolveSaveOne(
            param
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
    ): DeepPartial<TaxSnapshot> {
    
        this.notEmptyParams(params);

        const {
            itemsId,
            ...rest
        } = params;

        const orm : DeepPartial<TaxSnapshot> = {
            ...rest
        };

        if(itemsId?.length){

            orm.items = itemsId.map(id => ({id}));

        }

        return orm;

    }



}