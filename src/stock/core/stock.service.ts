import {BaseService} from "@/common/models/crud/base-service.crud";
import { StockQuery } from "./query/stock.query";
import { CreateParams, StockDataPayload, UnitParams, UpdateUnitParams } from "./types/params/service.params";
import { QueryUpdateParams } from "../item/types/params/service.params";
import { Operator } from "../enums/operator.enum";
import { ResolveUnitParams } from "../helpers/types/unit.type";
import { Injectable } from "@nestjs/common";
import { StockFactory } from "./stock.factory";

@Injectable()
export class StockService implements BaseService {

    constructor(
        private readonly query: StockQuery,
        private readonly factory : StockFactory
    ) { }

    /**
     * 
     * CREATE
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    create(
        params: CreateParams
    ) {
        return this.query.saveOne(params);
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    createMany(
        params : CreateParams[]
    ){
        return this.query.saveMany(
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
        params: QueryUpdateParams
    ) {
        return this.query.updateOne(
            id,
            params
        )
    }

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    async updateUnitData(
        id: string,
        params: UpdateUnitParams
    ) {

        const {
            quantity: currentQuantity,
            remaining : currentRemaining
        } = await this.getQuantityData(
            id
        )

        return this.resolveUpdateUnitData(
            id,
            {
                ...params,
                currentQuantity,
                currentRemaining
            }
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

    delete(
        id: string
    ) {
        return this.delete(id);
    }

    /**
     * 
     * METHODS
     * 
     */

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    addUnit(
        id: string,
        params: UnitParams
    ) {
        return this.updateUnitData(
            id,
            {
                ...params,
                operator : Operator.ADDITION
            }
        )
    }

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    subtractUnit(
        id : string,
        params : UnitParams
    ){
        return this.updateUnitData(
            id,
            {
                ...params,
                operator : Operator.SUBTRACTION
            }
        )
    }

    /**
         * 
         * RESOLVERS
         * 
         */

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    private resolveUpdateUnitData(
        id: string,
        params: ResolveUnitParams
    ) {

        const payload = this.factory.prepareUpdateUnitPayload(params);

        return this.updateOne(
            id,
            payload
        )

    }

    /**
    * 
    * HELPERS
    * 
    */

    /**
     * 
     * @param id 
     * @returns 
     */

    private async getQuantityData(
        id: string
    ): Promise<StockDataPayload> {

        const {
            quantity,
            remaining
        } = await this.query.findOneOrFail({
            where: {
                id
            },
            select: {
                quantity: true,
                remaining : true
            }
        });

        return {
            quantity,
            remaining
        }

    }

}