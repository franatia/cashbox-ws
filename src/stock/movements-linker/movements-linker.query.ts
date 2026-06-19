import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { MovementsLinker } from "../entities/transfer/movements-linker.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrmParams, SaveParams } from "./types/params/query.params";
import { notObjectEmpty } from "@/common/helpers/object.helper";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class MovementsLinkerQuery extends BaseQuery<MovementsLinker> {

    constructor(
        @InjectRepository(MovementsLinker)
        repo : Repository<MovementsLinker>
    ){
        super(MovementsLinker, repo);
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

        notObjectEmpty(params);

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

        return this.resolveSaveMany(params);

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

    makeOrm(params: OrmParams): DeepPartial<MovementsLinker> {
        
        notObjectEmpty(params);

        const {
            sourceMovementId,
            targetMovementId,
            transferItemId,
            ...rest
        } = params; 

        const orm : DeepPartial<MovementsLinker> = {
            ...rest
        };

        if(sourceMovementId){
            orm.sourceMovement = {
                id : sourceMovementId
            }
        }

        if(targetMovementId){
            orm.targetMovement = {
                id : targetMovementId
            }
        }

        if(transferItemId){
            orm.transferItem = {
                id : transferItemId
            }
        }

        return orm;

    }

}