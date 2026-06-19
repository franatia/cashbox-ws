import { Injectable } from "@nestjs/common";
import { Movement } from "../entities/movement.entity";
import { MovementPayload, SourceMovementPayload, TargetMovementPayload } from "./types/payload/service.payload";

@Injectable()
export class TransferItemFactory {

    /**
     * 
     * @param movements 
     * @returns 
     */

    parseToSourceMovementPayloads(
        movements : Movement[]
    ) : SourceMovementPayload[] {

        return movements.map(({
            id,
            quantity,
            lot,
            stockItem
        }) => ({
            id,
            quantity,
            lotId : lot?.id ?? "",
            stockItemId : stockItem?.id ?? ""
        }))

    }

    /**
     * 
     * @param movements 
     * @returns 
     */

    parseToTargetMovementPayloads(
        movements : Movement[]
    ) : TargetMovementPayload[] {

        return movements.map(({
            id,
            quantity,
            lot,
            stockItem
        }) => ({
            id,
            quantity,
            lotId : lot?.id ?? "",
            stockItemId : stockItem?.id ?? ""
        }))

    }

    /**
     * 
     * 
     * MAPPERS
     * 
     */

    /**
     * 
     * @param payloads 
     * @returns 
     */

    mapMovementPayloadsByLotId(
        payloads : MovementPayload[]
    ){

        const map = new Map<string, MovementPayload>();

        for(const payload of payloads){

            if(map.has(payload.lotId)) continue;

            map.set(payload.lotId, payload);

        };

        return map;

    }

}