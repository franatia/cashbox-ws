import { BadRequestException, Injectable } from "@nestjs/common";
import { ResolveUnitParams } from "../helpers/types/unit.type";
import { resolveUnitData } from "../helpers/unit.helper";
import { PrepareUpdateUnitParams, PrepareStatusParams } from "./types/params/factory.params";
import { PrepareUpdateUnitPayload, SubtractionPayload } from "./types/payloads/factory.payload";
import { LotStatus } from "../enums/lot.enum";
import { LotSubtraction } from "./types/payloads/service.payload";
import { Lot } from "../entities/lot/lot.entity";
import { LotParams } from "../movement/types/params/service.params";
import { isNumber } from "class-validator";

@Injectable()
export class LotFactory {

    /**
     * 
     * @param params 
     * @returns 
     */

    prepareUpdateUnitPayload(
        params: PrepareUpdateUnitParams
    ): PrepareUpdateUnitPayload {

        const {
            currentStatus,
            ...quantityParams
        } = params

        const {
            quantity,
            remaining
        } = this.prepareUnitPayload(
            quantityParams
        );

        const payload = this.preapareStatusPayload({
            quantity,
            remaining,
            currentStatus
        });

        return payload;

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private prepareUnitPayload(
        params: ResolveUnitParams
    ): PrepareUpdateUnitPayload {

        const {
            quantity,
            remaining
        } = resolveUnitData(params);

        if (!isNumber(quantity) && !isNumber(remaining)) {
            throw new BadRequestException(
                "Lot quantity and remaining are required"
            );
        }

        return {
            quantity,
            remaining
        }
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private preapareStatusPayload(
        params: PrepareStatusParams
    ): PrepareUpdateUnitPayload {

        const {
            remaining,
            quantity,
            currentStatus
        } = params;

        const payload: PrepareUpdateUnitPayload = {
            remaining,
            quantity
        }

        if (!isNumber(remaining)) return payload;

        
        if (
            remaining === 0 &&
            currentStatus === LotStatus.AVAILABLE
        ) {
            payload.status = LotStatus.OUT
        }

        if (
            remaining > 0 &&
            currentStatus === LotStatus.OUT
        ) {
            payload.status = LotStatus.AVAILABLE
        }

        return payload;

    }

    /**
     * 
     * @param lots 
     * @param options 
     * @returns 
     */

    prepareSubtractionPayloads(
        lots: Lot[],
        quantity: number
    ) : SubtractionPayload {

        let rest = quantity;
        const subtractions: LotSubtraction[] = [];

        for (const lot of lots) {

            const subtraction: LotSubtraction = {
                lotId: lot.id,
                subtraction: (lot.remaining >= rest)
                    ? rest
                    : lot.remaining
            };

            rest -= subtraction.subtraction;

            subtractions.push(subtraction);

        }

        return {
            subtractions,
            subtractionQuantity : quantity
        };

    }

    /**
     * 
     * @param lots 
     * @returns 
     */

    prepareSubtractionPayloadsFromLotParams(
        lots : LotParams[]
    ) : SubtractionPayload {

        let quantity = 0;
        const subtractions : LotSubtraction[] = [];

        for(const {id, quantity: lotQuantity} of lots){

            quantity += lotQuantity;

            subtractions.push({
                lotId: id,
                subtraction : lotQuantity
            });

        }

        return {
            subtractionQuantity : quantity,
            subtractions
        };

    }

}