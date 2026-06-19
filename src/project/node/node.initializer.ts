import { CashboxService } from "@/cashbox/cashbox.service";
import { BaseInitializer } from "@/common/models/crud/base-initializer.crud";
import { AuthContext } from "@/auth/auth.context";
import { Injectable } from "@nestjs/common";
import { NodeEvent } from "./event-listener/node.event";
import { Node } from "../entities/node.entity";
import { NodeSaver } from "./query/node.saver";
import { SaveParams } from "./types/param/query.param";
import { NodeQuery } from "./query/node.query";
import { CreateParams } from "./types/param/service.param";

@Injectable()
export class NodeInitializer extends BaseInitializer<
    Node,
    SaveParams,
    NodeQuery,
    NodeSaver
> {

    constructor(
        saver: NodeSaver,
        authContext: AuthContext,

        private readonly eventEmmiter: NodeEvent,
        private readonly cashboxService: CashboxService,
    ) {
        super(saver, authContext)
     }

    /**
     * 
     * @param params 
     * @returns 
     */
 
    async initialize(
        params: CreateParams
    ) {

        return super.initialize({
            ...params,
            projectId : this.userProjectId
        });
        
    }

    /**
     * 
     * @param node 
     */

    protected async createLinkedEntities(entity: Node) {
        await this.cashboxService.createCashbox(
            entity.id,
            this.userProjectId
        );
    }

    /**
     * 
     * @param entity 
     */

    protected async onCreate(
        entity: Node
    ){
        await this.eventEmmiter.emitNodeCreated(
            entity.id
        )
    }

}