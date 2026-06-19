import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { Stock } from "../../entities/stock.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrmParams, SaveParams, UpdateParams } from "../types/params/query.params";
import { Injectable } from "@nestjs/common";
import { StockEvent } from "../event-listener/stock.event";

@Injectable()
export class StockQuery extends BaseQuery<Stock> {

    constructor(
        @InjectRepository(Stock)
        repo: Repository<Stock>,

        private readonly event : StockEvent
    ) {
        super(Stock, repo);
    }
    
    /**
     * 
     * FINDERS
     * 
     */

    findByItemId(
        itemId : string
    ){
        return this.findOneOrFail({
            where : {
                items : {
                    id : itemId
                }
            }
        })
    }

    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * @param orm 
     */

    async save(
        ...orm: DeepPartial<Stock>[]
    ) {
        const entities = await super.save(...orm);

        await this.event.emitCreated(
            entities.map(
                ({id}) => id
            )
        );

        return entities;

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    async saveOne(
        params: SaveParams
    ) {

        return this.resolveSaveOne(
            params
        );

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    async saveMany(
        params: SaveParams[]
    ) {
        return this.resolveSaveMany(
            params
        );
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
        id: string,
        params: UpdateParams
    ) {

        return this.resolveUpdate(
            {id},
            params
        );

    }

    /**
     * 
     * DELETERS
     * 
     */

    /**
     * 
     * @param id 
     * @returns 
     */

    async deleteOne(
        id: string
    ) {
        await this.delete({id});

        return {
            deletedStock: id
        };
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
    ) {

        const {
            productItemId,
            projectId,
            ...rest
        } = params;

        const orm: DeepPartial<Stock> = {
            ...rest
        }

        if (projectId) {
            orm.project = {
                id: projectId
            }
        }

        if (productItemId) {
            orm.productItem = {
                id: productItemId
            }
        }

        return orm;

    }

}