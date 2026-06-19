import { LotAccumulatedQuery } from "./lot-accumulated.query";
import { GetLotsOptions, GetLotsType, ResolveFindByLotsParams } from "./types/params/service.params";
import { LotAccumulatedView } from "../entities/lot/lot-accumulated.view";
import { BadRequestException, Injectable } from "@nestjs/common";
import { AccumulatedOptions } from "./types/params/query.params";
import { ResolveGetLotsPayload } from "./types/payloads/service.payload";

@Injectable()
export class LotAccumulatedService {

    constructor(
        private readonly query: LotAccumulatedQuery
    ) { }

    /**
     * 
     * GETTERS
     * 
     */

    /**
     * 
     * @param quantity 
     * @param options 
     * @returns 
     */

    async getLotsByRemainingRequired(
        options: GetLotsOptions
    ) {

        const {
            lots,
            quantity
        } = await this.resolveGetLotsByOptions(
            options,
            GetLotsType.REMAINING
        );

        this.remainingIsMoreThanOrEqual(
            quantity,
            lots
        );

        return lots;

    }

    /**
     * 
     * @param quantity 
     * @param options 
     * @returns 
     */

    async getLotsByQuantityRequired(
        options: GetLotsOptions
    ) {
        const {
            lots,
            quantity
        } = await this.resolveGetLotsByOptions(
            options,
            GetLotsType.QUANTITY
        );

        this.quantityIsMoreThanOrEqual(
            quantity,
            lots
        );

        this.remainingIsMoreThanOrEqual(
            quantity,
            lots
        );

        return lots;
    }
    
    /**
     * 
     * RESOLVERS
     * 
     */

    /**
     * 
     * @param options 
     * @param type 
     * @returns 
     */

    private async resolveGetLotsByOptions(
        options: GetLotsOptions,
        type: GetLotsType
    ) : Promise<ResolveGetLotsPayload> {

        const {
            lots,
            status,
            type: lotType,
            quantity,
            stockItemId
        } = options;

        if (lots?.length) {

            return this.resolveFindByLotsParams(
                {
                    lots,
                    stockItemId
                },
                type
            );

        }
        else if(
            (status || lotType) &&
            (quantity !== undefined && quantity > 0)
        ){

            const accLots = await this.query.findLotsByOptions({
                status,
                type : lotType,
                stockItemId,
                ...this.resolveAccumulatedOptionsByGetType(
                    quantity,
                    type
                )
            });

            return {
                lots : accLots,
                quantity
            }

        }

        throw new BadRequestException(
            "Get lots params are invalid"
        );
        
    }

    /**
     * 
     * @param params 
     * @param type 
     * @returns 
     */

    private async resolveFindByLotsParams(
        params: ResolveFindByLotsParams,
        type: GetLotsType,
    ) : Promise<ResolveGetLotsPayload> {

        const {
            lots,
            stockItemId
        } = params;

        let totalQuantity = 0;

        const accLots = await Promise.all(
            lots.map(({
                id,
                quantity
            }) => {
                totalQuantity += quantity;
                return this.query.findLotsByOptions({
                    lotsId: [id],
                    stockItemId,
                    ...this.resolveAccumulatedOptionsByGetType(
                        quantity,
                        type
                    )
                });
            })
        )

        return {
            lots : accLots.flatMap(lot => lot),
            quantity : totalQuantity
        };

    }

    /**
     * 
     * @param quantity 
     * @param type 
     * @returns 
     */

    private resolveAccumulatedOptionsByGetType(
        quantity: number,
        type: GetLotsType
    ): AccumulatedOptions {

        if (type === GetLotsType.QUANTITY) {
            return {
                quantityAccumulated: quantity,
                remainingAccumulated: quantity
            }
        } else if (type === GetLotsType.REMAINING) {
            return {
                remainingAccumulated: quantity
            }
        }

        throw new BadRequestException(
            "Should to use a get by options type valide"
        );

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param quantity 
     * @param lots 
     */

    private remainingIsMoreThanOrEqual(
        remaining: number,
        lots: LotAccumulatedView[]
    ) {

        let remainingAccumulated = 0;

        lots.forEach(lot => {
            remainingAccumulated += lot.remaining;
        })

        if (remainingAccumulated < remaining) {
            throw new BadRequestException(
                "Lot quantity accumulated is less than needed"
            );
        }

    }

    /**
     * 
     * @param quantity 
     * @param lots 
     */

    private quantityIsMoreThanOrEqual(
        quantity: number,
        lots: LotAccumulatedView[]
    ) {
        let quantityAccumulated = 0;

        lots.forEach(lot => {
            quantityAccumulated += lot.quantity;
        })

        if (quantityAccumulated < quantity) {
            throw new BadRequestException(
                "Lot quantity accumulated is less than needed"
            );
        }
    }

}