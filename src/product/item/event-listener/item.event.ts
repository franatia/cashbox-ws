import { EventNames } from "@/event-listener/enum/events.enum";
import { EventListenerService } from "@/event-listener/event-listener.service";
import { ProductItemsCreatedParam } from "@/event-listener/types/params/listeners.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ItemEvent {

    constructor(
        private readonly eventListener : EventListenerService
    ){}

    emitCreated(
        param : ProductItemsCreatedParam
    ){
        return this.eventListener.emit(
            EventNames.PRODUCT_ITEMS_CREATED,
            param
        );
    }

}