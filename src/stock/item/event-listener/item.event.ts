import { EventNames } from "@/event-listener/enum/events.enum";
import { EventListenerService } from "@/event-listener/event-listener.service";
import { StockItemUnitUpdatedParam } from "@/event-listener/types/params/listeners.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ItemEvent {

    constructor(
        private readonly eventListener : EventListenerService
    ){}

    /**
     * 
     * HANDLERS
     * 
     */

    emitUnitUpdated(
        param : StockItemUnitUpdatedParam
    ){
        return this.eventListener.emit(
            EventNames.STOCK_ITEM_UNIT_UPDATED,
            param
        )
    }

}