import {BaseService} from "@/common/models/crud/base-service.crud";
import { CreateParams, ItemDataPayload, QueryUpdateParams, ResolveSubtractOptions, SubtractOptions, UnitParams, UpdateUnitParams } from "./types/params/service.params";
import { ItemQuery } from "./item.query";
import { Operator } from "../enums/operator.enum";
import { ResolveUnitParams } from "../helpers/types/unit.type";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { LotService } from "../lot/lot.service";
import { AdditionPayload, SubtractionPayload, } from "./types/payloads/service.payload";
import { ItemFactory } from "./item.factory";
import { LotParams } from "../movement/types/params/service.params";
import { LotUnitSource } from "../lot/enums/lot.enum";
import { ItemEvent } from "./event-listener/item.event";
import { AdditionPayload as LotAdditionPayload } from "../lot/types/payloads/service.payload";
import { AuthContext } from "@/auth/auth.context";

@Injectable()
export class ItemService implements BaseService {

    constructor(
        private readonly query: ItemQuery,
        private readonly factory: ItemFactory,
        private readonly event: ItemEvent,

        @Inject(forwardRef(() => LotService))
        private readonly lotService: LotService,
        private readonly authContext : AuthContext
    ) { }

    /**
     * 
     * GETS
     * 
     */

    /**
     * 
     * @param id 
     * @returns 
     */

    async getData(
        id: string
    ): Promise<ItemDataPayload> {

        const {
            quantity,
            remaining
        } = await this.query.findOneOrFail({
            where: {
                id
            },
            select: {
                quantity: true,
                remaining: true
            }
        });

        return {
            quantity,
            remaining
        }

    }

    /**
     * 
     * @param productItemId 
     * @returns 
     */

    getByAuthContext(
        productItemId : string
    ){

        return this.query.findOneOrFail({
            where : {
                stock : {
                    productItem : {
                        id : productItemId
                    }
                },
                node : {
                    id : this.authContext.userNode
                }
            }
        })



    }

    /**
     * 
     * CREATORS
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
        params: CreateParams[]
    ) {
        return this.query.saveMany(params);
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

    update(
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
     * @param params 
     * @returns 
     */

    async updateUnitData(
        id: string,
        params: UpdateUnitParams
    ) {

        const {
            quantity: currentQuantity,
            remaining: currentRemaining,
        } = await this.getData(
            id
        )

        return this.resolveUpdateUnitData(
            id,
            {
                currentQuantity,
                currentRemaining,
                ...params
            }
        )

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

    delete(
        id: string
    ) {
        return this.query.deleteOne(
            id
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

    private async resolveUpdateUnitData(
        id: string,
        params: ResolveUnitParams
    ) {

        const {
            operator,
            quantity,
            remaining
        } = params;

        const payload = this.factory.prepareUpdateUnitPayload(
            params
        );

        const entity = await this.update(
            id,
            payload
        );

        await this.event.emitUnitUpdated({
            id,
            operator,
            quantity,
            remaining
        })

        return entity;

    }

    /**
     * 
     * METHODS
     * 
     */

    /**
     * 
     * @param id 
     * @param quantity 
     * @param options 
     * @returns 
     */

    async subtractRemaining(
        id: string,
        options: SubtractOptions
    ): Promise<SubtractionPayload> {

        return this.resolveSubtraction(
            {
                ...options,
                itemId: id
            },
            LotUnitSource.REMAINING
        )

    }

    /**
     * 
     * @param id 
     * @param quantity 
     * @param options 
     * @returns 
     */

    async subtractQuantity(
        id: string,
        options: SubtractOptions
    ): Promise<SubtractionPayload> {

        return this.resolveSubtraction(
            {
                ...options,
                itemId: id
            },
            LotUnitSource.QUANTITY
        )

    }

    /**
     * 
     * @param lotId 
     * @param quantity 
     * @returns 
     */

    async addRemaining(
        lots: LotParams[]
    ): Promise<AdditionPayload> {

        const additions = await this.resolveAdditionSource(
            lots,
            LotUnitSource.REMAINING
        );

        return additions;

    }

    /**
     * 
     * @param lotId 
     * @param quantity 
     * @returns 
     */

    async addQuantity(
        lots: LotParams[]
    ): Promise<AdditionPayload> {

        const additions = await this.resolveAdditionSource(
            lots,
            LotUnitSource.QUANTITY
        )

        return additions;

    }

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
                operator: Operator.ADDITION
            }
        )

    }

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    removeUnit(
        id: string,
        params: UnitParams
    ) {
        return this.updateUnitData(
            id,
            {
                ...params,
                operator: Operator.SUBTRACTION
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
     * @param options 
     * @param source 
     * @returns 
     */

    private async resolveSubtraction(
        options: ResolveSubtractOptions,
        source: LotUnitSource
    ) {

        switch (source) {
            case LotUnitSource.QUANTITY:
                return this.resolveSubtractQuantity(
                    options
                );
            case LotUnitSource.REMAINING:
                return this.resolveSubtractRemaining(
                    options
                );
            default:
                throw new BadRequestException(
                    "Lot unit source is invalid"
                );
        }

    }

    /**
     * 
     * @param options 
     * @returns 
     */

    private async resolveSubtractRemaining(
        options: ResolveSubtractOptions
    ): Promise<SubtractionPayload> {

        const {
            itemId,
            lotStatus,
            lotType
        } = options;

        const {
            subtractions
        } = await this.lotService.subtractRemaining(
            {
                ...options,
                status : lotStatus,
                type : lotType,
                stockItemId: itemId
            }
        )

        return subtractions

    }


    /**
     * 
     * @param options 
     * @returns 
     */

    private async resolveSubtractQuantity(
        options: ResolveSubtractOptions
    ): Promise<SubtractionPayload> {

        const {
            itemId,
            lotStatus,
            lotType
        } = options;

        const {
            subtractions
        } = await this.lotService.subtractQuantity(
            {
                ...options,
                status : lotStatus,
                type : lotType,
                stockItemId: itemId
            }
        );

        return subtractions

    }

    /**
     * 
     * @param lots 
     * @param source 
     * @returns 
     */

    private async resolveAdditionSource(
        lots: LotParams[],
        source: LotUnitSource
    ) {

        switch (source) {
            case LotUnitSource.QUANTITY:
                return this.resolveAddQuantity(lots);
            case LotUnitSource.REMAINING:
                return this.resolveAddRemaining(lots);
            default:
                throw new BadRequestException(
                    "Lot unit source is invalid"
                )
        }

    }

    /**
     * 
     * @param lots 
     * @returns 
     */

    private async resolveAddQuantity(
        lots: LotParams[]
    ) {

        const payload: LotAdditionPayload[] = [];

        for (const { id, quantity } of lots) {

            const addition = await this.lotService.addQuantity(
                id,
                quantity
            )

            payload.push(addition);
        }

        return payload;

    }

    /**
     * 
     * @param lots 
     * @returns 
     */

    private async resolveAddRemaining(
        lots: LotParams[]
    ) {

        const payload: LotAdditionPayload[] = [];

        for (const { id, quantity } of lots) {

            const addition = await this.lotService.addRemaining(
                id,
                quantity
            )

            payload.push(addition);
        }

        return payload;

    }

}