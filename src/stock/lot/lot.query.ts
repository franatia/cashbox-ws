import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { Lot } from "../entities/lot/lot.entity";
import { DeepPartial, FindOptionsSelect, In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { OrmParams, SaveParams, UpdateParams } from "./types/params/query.params";
import { isEmptyObject, notObjectEmpty } from "@/common/helpers/object.helper";
import { LotAccumulatedView } from "../entities/lot/lot-accumulated.view";
import { BadRequestException, Injectable } from "@nestjs/common";
import { LotEvent } from "./event-listener/lot.event";

@Injectable()
export class LotQuery extends BaseQuery<Lot> {

    constructor(
        @InjectRepository(Lot)
        repo : Repository<Lot>,

        private readonly event : LotEvent
    ){
        super(Lot, repo);
    }

    /**
     * 
     * FINDERS
     * 
     */

    /**
     * 
     * @param entities 
     * @returns 
     */

    findByLotAccViews(
        entities : LotAccumulatedView[]
    ){
        const ids = entities.map(accLot => accLot.id);

        return this.findMany({
            where : {
                id : In(ids)
            }
        })
    }

    /**
     * 
     * @param ids 
     * @param select 
     * @returns 
     */

    findManyById(
        ids : string[],
        select : FindOptionsSelect<Lot>
    ){

        return this.findMany({
            where : {
                id : In(ids)
            },
            select
        })

    }

    async findOneAndUpdate(
        id : string,
        params : UpdateParams
    ){

        if(!isEmptyObject(params)){
            await this.updateOne(
                id,
                params
            )
        };

        return this.findOneOrFail({
            where : {
                id
            }
        })

    }

    /**
     * 
     * SAVERS
     * 
     */

    async save(
        ...orm : DeepPartial<Lot>[]
    ){

        const entities = await super.save(...orm);

        await this.event.emitCreated(
            entities.map(
                ({id, stockItem, quantity}) => ({
                    id,
                    stockItemId : stockItem.id,
                    quantity
                })
            )
        )

        return entities;

    }

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

        if(!raw.length){
            throw new BadRequestException(
                "Lot was not saved successfully"
            );
        }

        return raw[0];

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    saveMany(
        params : SaveParams[]
    ){

        const orm = this.makeManyOrm(params);

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

        return this.resolveUpdate(
            {id},
            params
        );

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
        return this.delete(
            {id}
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
        params : OrmParams
    ){

        const {
            costSnapshotId,
            reserveId,
            stockItemId,
            ...rest
        } = params;

        const orm : DeepPartial<Lot> = {
            ...rest
        };

        if(costSnapshotId){
            orm.costSnapshot = {
                id : costSnapshotId
            }
        }

        if(reserveId){
            orm.reserve = {
                id : reserveId
            }
        }

        if(stockItemId){
            orm.stockItem = {
                id : stockItemId
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

}