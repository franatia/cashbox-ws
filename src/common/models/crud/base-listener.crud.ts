import { OnModuleInit } from "@nestjs/common";

export interface BaseListener extends OnModuleInit {
    subscribeEvents() : void;
}