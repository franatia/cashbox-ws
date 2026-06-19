import {BaseService} from "@/common/models/crud/base-service.crud";
import { CreateParams, GetLotsFilterParams, QueryUpdateParams, ResolveUpdateUnitParams, UnitParams, UpdateParams, UpdateUnitParams, SubtractionOptions, GetByOptions, ResolveSubtractPayloadParams } from "./types/params/service.params";
import { LotQuery } from "./lot.query";
import { Operator } from "../enums/operator.enum";
import { notObjectEmpty } from "@/common/helpers/object.helper";
import { LotAccumulatedService } from "../lot-accumulated/lot-accumulated.service";
import { AdditionPayload, LotDataPayload, LotSubtraction } from "./types/payloads/service.payload";
import { LotFactory } from "./lot.factory";
import { LotUnitSource } from "./enums/lot.enum";
import { SubtractionPayload } from "./types/payloads/factory.payload";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { LotEvent } from "./event-listener/lot.event";
import { Lot } from "../entities/lot/lot.entity";
import { ItemService } from "../item/item.service";
import { LotInitializer } from "./lot.initializer";

@Injectable()
export class LotService implements BaseService {

    constructor(
        private readonly lotAccService: LotAccumulatedService,

        @Inject(forwardRef(() => ItemService))
        private readonly itemService: ItemService,

        private readonly query: LotQuery,
        private readonly factory: LotFactory,
        private readonly initializer:  LotInitializer,
        private readonly event: LotEvent
    ) { }

    /**
     * 
     * GETS
     * 
     */

    /**
     * 
     * @param productItemId 
     * @returns 
     */

    async getStockItemIdByAuthContext(
        productItemId: string
    ) {
        const stock = await this.itemService.getByAuthContext(productItemId);

        return stock.id;

    }

    /**
     * 
     * @param quantity 
     * @param options 
     * @returns 
     */

    async getLotsByRemainingRequired(
        options: GetByOptions
    ) {

        const accLots = await this.lotAccService.getLotsByRemainingRequired(
            options
        )

        return this.query.findByLotAccViews(
            accLots
        )

    }

    /**
     * 
     * @param quantity 
     * @param options 
     */

    async getLotsByQuantityRequired(
        options: GetByOptions
    ) {

        const accLots = await this.lotAccService.getLotsByQuantityRequired(
            options
        );

        return this.query.findByLotAccViews(
            accLots
        )

    }

    /**
     * 
     * @param id 
     * @returns 
     */

    private async getData(
        id: string
    ): Promise<LotDataPayload> {

        const {
            quantity,
            remaining,
            status
        } = await this.query.findOneOrFail({
            where: {
                id
            },
            select: {
                quantity: true,
                remaining: true,
                status: true
            }
        })

        return {
            quantity,
            remaining,
            status
        }

    }

    /**
     * 
     * @param filter 
     * @returns 
     */

    async getLotsByFilter(
        filter: GetLotsFilterParams
    ) {

        return this.query.findMany({
            where: {
                ...filter
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
     * @param lotsId 
     * @returns 
     */

    async createByLotSeed(
        lotId: string,
        stockItemId: string,
    ) {

        const {
            costSnapshot,
            status,
            type,
            reserve,
            expiresAt
        } = await this.query.findOneOrFail({
            where: {
                id: lotId
            },
            select: {
                id: true,
                reserve: true,
                status: true,
                type: true,
            },
            relations: {
                costSnapshot: true
            }
        })

        return this.query.saveOne({
            reserveId: reserve?.id,
            status,
            type,
            stockItemId,
            costSnapshotId: costSnapshot?.id,
            quantity: 0,
            remaining: 0,
            expiresAt
        });

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    async create(
        params: CreateParams
    ): Promise<Lot> {

        const {
            productItem,
            inputData,
            ...rest
        } = params;

        const {
            quantity,
            id: productItemId
        } = productItem;

        const costSnapshot = await this.initializer.resolveCosts({
            productItem,
            inputData
        })

        const lot = await this.query.saveOne({
            quantity,
            remaining: quantity,
            costSnapshotId: costSnapshot.id,
            stockItemId: await this.getStockItemIdByAuthContext(
                productItemId
            ),
            ...rest
        });

        return {
            ...lot,
            costSnapshot
        };

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    async createMany(
        params: CreateParams[]
    ) {

        const lots: Lot[] = [];

        for (const param of params) {

            const lot = await this.create(
                param
            );

            lots.push(lot);

        }

        return lots;

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
     */

    async update(
        id: string,
        params: UpdateParams
    ) {

        notObjectEmpty(params);

        const {
            operator,
            quantity,
            remaining,
            ...rest
        } = params;

        if (operator) {
            await this.updateUnitData(
                id,
                {
                    operator,
                    quantity,
                    remaining
                }
            )
        }

        return this.query.findOneAndUpdate(
            id,
            rest
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
            remaining: currentRemaining,
            status: currentStatus
        } = await this.getData(id);

        return this.resolveUpdateUnitData(
            id,
            {
                ...params,
                currentStatus,
                currentRemaining,
                currentQuantity,
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
        return this.query.deleteOne(
            id
        );
    }

    /**
     * 
     * RESOLVERS
     * 
     */

    private async resolveUpdateUnitData(
        id: string,
        params: ResolveUpdateUnitParams
    ) {

        const {
            quantity,
            remaining,
            operator
        } = params;

        const payload = this.factory.prepareUpdateUnitPayload(
            params
        );

        const entity = await this.updateOne(
            id,
            payload
        )

        await this.event.emitUnitUpdated({
            id: entity.id,
            operator,
            quantity,
            remaining
        })

        return entity;

    }

    /**
     * 
     * @param options 
     * @param source 
     * @returns 
     */

    private async resolveSubtraction(
        options: SubtractionOptions,
        source: LotUnitSource
    ): Promise<SubtractionPayload> {

        const {
            lots,
            status,
            type,
            quantity,
            stockItemId
        } = options;


        if (lots?.length) {
            return this.factory.prepareSubtractionPayloadsFromLotParams(
                lots
            );
        } else if (
            (status !== undefined ||
                type !== undefined) &&
            (quantity !== undefined &&
                quantity >= 0)
        ) {

            return this.resolveSubtractionSource(
                {
                    stockItemId,
                    quantity,
                    type,
                    status
                },
                source
            )

        }

        throw new BadRequestException(
            "The subtraction options provided are invalid"
        );

    }

    /**
     * 
     * @param options 
     * @param source 
     * @returns 
     */

    resolveSubtractionSource(
        options: ResolveSubtractPayloadParams,
        source: LotUnitSource
    ) {

        switch (source) {
            case LotUnitSource.QUANTITY:
                return this.resolveSubtractQuantityPayload(
                    options
                );
            case LotUnitSource.REMAINING:
                return this.resolveSubtractRemainingPayload(
                    options
                );
            default:
                throw new BadRequestException(
                    "Lot unit source is invalid"
                )
        }

    }

    /**
     * 
     * @param options 
     * @returns 
     */

    private async resolveSubtractRemainingPayload(
        options: ResolveSubtractPayloadParams
    ) {

        const {
            quantity
        } = options;

        const lots = await this.getLotsByRemainingRequired(
            options
        )

        return this.factory.prepareSubtractionPayloads(
            lots,
            quantity
        );

    }

    /**
     * 
     * @param quantity 
     * @param options 
     * @returns 
     */

    private async resolveSubtractQuantityPayload(
        options: ResolveSubtractPayloadParams
    ) {

        const {
            quantity
        } = options;

        const lots = await this.getLotsByQuantityRequired(
            options
        );

        return this.factory.prepareSubtractionPayloads(
            lots,
            quantity
        )
    }

    /**
     * 
     * METHODS
     * 
     */

    /**
     * 
     * @param quantity 
     * @param options 
     * @returns 
     */

    async subtractRemaining(
        options: SubtractionOptions
    ) {

        const payload = await this.resolveSubtraction(
            options,
            LotUnitSource.REMAINING
        );

        await this.removeRemainingsByPayloads(
            payload.subtractions
        );

        return payload;

    }

    /**
     * 
     * @param quantity 
     * @param options 
     * @returns 
     */

    async subtractQuantity(
        options: SubtractionOptions
    ) {
        const payload = await this.resolveSubtraction(
            options,
            LotUnitSource.QUANTITY
        );

        await this.removeQuantitiesByPayloads(
            payload.subtractions
        );

        return payload;
    }

    /**
     * 
     * @param id 
     * @param remaining 
     * @returns 
     */

    async addRemaining(
        id: string,
        remaining: number
    ): Promise<AdditionPayload> {

        await this.addUnit(
            id,
            {
                remaining,
            }
        )

        return {
            lotId: id,
            addition: remaining
        };

    };

    /**
     * 
     * @param id 
     * @param quantity 
     * @returns 
     */

    async addQuantity(
        id: string,
        quantity: number
    ): Promise<AdditionPayload> {

        await this.addUnit(
            id,
            {
                quantity,
                remaining: quantity
            }
        )

        return {
            lotId: id,
            addition: quantity
        };

    };



    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    private addUnit(
        id: string,
        params: UnitParams
    ) {

        notObjectEmpty(params);

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

    private removeUnit(
        id: string,
        params: UnitParams
    ) {

        notObjectEmpty(params);

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
     * @param payloads 
     * @returns 
     */

    private async removeRemainingsByPayloads(
        payloads: LotSubtraction[]
    ) {

        const lots : Lot[] = [];
        
        for(const {lotId, subtraction} of payloads){
            
            const lot = await this.removeUnit(
                lotId,
                {
                    remaining : subtraction
                }
            )

            lots.push(lot);

        }

        return lots;
    }

    /**
     * 
     * @param payloads 
     * @returns 
     */

    private async removeQuantitiesByPayloads(
        payloads: LotSubtraction[]
    ) {
        const lots : Lot[] = [];
        
        for(const {lotId, subtraction} of payloads){
            
            const lot = await this.removeUnit(
                lotId,
                {
                    remaining : subtraction,
                    quantity : subtraction
                }
            )

            lots.push(lot);

        }

        return lots;
    }

}