import { Global, Module } from "@nestjs/common";
import { EventListenerService } from "./event-listener.service";

@Global()
@Module({
    providers : [
        EventListenerService
    ],
    exports : [
        EventListenerService
    ]
})
export class EventListenerModule {}