import { EventNames } from "@/event-listener/enum/events.enum";
import { EventListenerService } from "@/event-listener/event-listener.service";
import { StocksCreatedParam } from "@/event-listener/types/params/listeners.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StockEvent {

    constructor(
        private readonly eventListener : EventListenerService
    ){}

    /**
     * 
     * @param param 
     */

    emitCreated(
        param : StocksCreatedParam
    ){

        return this.eventListener.emit(
            EventNames.STOCKS_CREATED,
            param
        )

    }

}