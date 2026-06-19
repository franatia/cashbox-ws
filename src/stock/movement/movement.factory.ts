import { AdditionPayload, LotSubtraction } from "../lot/types/payloads/service.payload";
import { LotMovementPayload } from "./types/payloads/lot.payloads";

export class MovementFactory {

    /**
     * 
     * @param subPayloads 
     * @returns 
     */

    parseLotSubtractionToMovementPayload(
        subPayloads : LotSubtraction[]
    ) : LotMovementPayload[] {
        return subPayloads.map(({
            lotId,
            subtraction
        }) => ({
            lotId,
            quantity : subtraction
        }))
    }

    /**
     * 
     * @param addPayloads 
     * @returns 
     */

    parseLotAdditionToMovementPayload(
        addPayloads : AdditionPayload[]
    ) : LotMovementPayload[] {
        return addPayloads.map(({
            addition,
            lotId
        }) => ({
            lotId,
            quantity : addition
        }))
    }

}