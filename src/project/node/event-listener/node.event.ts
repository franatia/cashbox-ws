import { EventNames } from "@/event-listener/enum/events.enum";
import { EventListenerService } from "@/event-listener/event-listener.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NodeEvent {

    constructor(
        private readonly eventListener : EventListenerService
    ){}

    /**
     * 
     * @param id 
     * @returns 
     */
    
    emitNodeCreated(
        id : string
    ){
        return this.eventListener.emit(
            EventNames.NODE_CREATED,
            id
        )
    }

}