import { Injectable } from "@nestjs/common";
import { ListenerFunction } from "./types/listeners.type";

@Injectable()
export class EventListenerService {

    private readonly eventsMap : Map<string, ListenerFunction[]> = new Map();

    constructor(){}

    private getListenersByEvent(
        event : string
    ){

        if(!this.eventsMap.has(event)){
            this.eventsMap.set(
                event,
                []
            )
        };

        return this.eventsMap.get(event)!!;

    }

    set(
        event : string,
        listenerFunction : ListenerFunction
    ){
        
        const listeners = this.getListenersByEvent(event);

        listeners.push(listenerFunction);

    }

    async emit(
        event : string,
        payload : any
    ){

        const listeners = this.getListenersByEvent(event);

        for(const listener of listeners){
            await listener(payload)
        };

    }

    clear(
        event : string
    ){
        this.eventsMap.set(event, []);
    }

}