import { EventNames } from "@/event-listener/enum/events.enum";
import { EventListenerService } from "@/event-listener/event-listener.service";
import { LotsCreatedParam, LotUnitUpdatedParam } from "@/event-listener/types/params/listeners.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LotEvent {

    constructor(
        private readonly eventListener : EventListenerService
    ){}
    
    /**
     * 
     * @param payload 
     * @returns 
     */

    async emitCreated(
        payload : LotsCreatedParam
    ){

        const filter = payload.filter(payload => payload.quantity > 0);

        if(!filter.length) return;

        await this.eventListener.emit(
            EventNames.LOTS_CREATED,
            payload
        )
    }

    /**
     * 
     * @param payload 
     * @returns 
     */

    emitUnitUpdated(
        payload : LotUnitUpdatedParam
    ){
        return this.eventListener.emit(
            EventNames.LOT_UNIT_UPDATED,
            payload
        )
    }

}