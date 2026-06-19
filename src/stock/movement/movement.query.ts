import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { Movement } from "../entities/movement.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrmParams, SaveParams, UpdateParams } from "./types/params/query.params";
import { notObjectEmpty } from "@/common/helpers/object.helper";

export class MovementQuery extends BaseQuery<Movement> {

    constructor(
        @InjectRepository(Movement)
        repo : Repository<Movement>
    ){
        super(Movement, repo);
    }

    /**
     * 
     * SAVE
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

        const orm = this.makeOrm(params);

        return this.save(orm);

    }

    saveMany(
        params : SaveParams[]
    ){

        this.validateParams(params);

        const orm = this.makeManyOrm(
            params
        );

        return this.save(...orm);

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

    deleteOne(
        id : string
    ){

        return this.delete({id});

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
        params : OrmParams
    ){

        const {
            lotId,
            stockItemId,
            transferItemId,
            userCreatorId,
            ...rest
        } = params;

        const orm : DeepPartial<Movement> = {
            ...rest
        }

        if(lotId){
            orm.lot = {
                id : lotId
            }
        }

        if(stockItemId){
            orm.stockItem = {
                id : stockItemId
            }
        }

        if(transferItemId){
            orm.transferItem = {
                id : transferItemId
            }
        };

        if(userCreatorId){
            orm.createdBy = {
                id : userCreatorId
            }
        }

        return orm;

    }
    
    /**
     * 
     * @param params 
     * @returns 
     */

    makeManyOrm(
        params : OrmParams[]
    ){
        return params.map(param => (
            this.makeOrm(param)
        ))
    }
    
    /**
     * 
     * @param params 
     */

    private validateParams(
        params : object[]
    ){

        params.forEach(param => {
            notObjectEmpty(param)
        })

    }

}