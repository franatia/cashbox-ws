import { AuthContext } from "@/auth/auth.context";
import { LotsCreatedParam, LotUnitUpdatedParam, StocksCreatedParam } from "@/event-listener/types/params/listeners.param";
import { ProjectService } from "@/project/core/project.service";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ItemService } from "../item.service";
import { EventNames } from "@/event-listener/enum/events.enum";
import { EventListenerService } from "@/event-listener/event-listener.service";
import { BaseListener } from "@/common/models/crud/base-listener.crud";
import { ItemQuery } from "../item.query";
import { NodeFinder } from "@/project/node/query/node.finder";

@Injectable()
export class ItemListener implements BaseListener {

    constructor(

        private readonly service : ItemService,
        private readonly query : ItemQuery,

        private readonly nodeFinder : NodeFinder,
        private readonly authContext : AuthContext,

        @Inject(forwardRef(() => EventListenerService))
        private readonly eventListener : EventListenerService

    ){}

    onModuleInit() {
        this.subscribeEvents()
    }

    subscribeEvents() {
        
       this.eventListener.set(
            EventNames.STOCKS_CREATED,
            ids => this.handleStocksCreated(ids)
        ) 

        this.eventListener.set(
            EventNames.LOTS_CREATED,
            ids => this.handleLotsCreated(ids)
        )

        this.eventListener.set(
            EventNames.LOT_UNIT_UPDATED,
            param => this.handleLotUnitUpdated(param)
        )

    }

    /**
     * 
     * HANDLERS
     * 
     */

    /**
     * 
     * @param ids 
     */

    async handleStocksCreated(
        ids : StocksCreatedParam
    ){

        const nodesId = await this.getNodesId();

        await this.service.createMany(
            nodesId.flatMap(nodeId => (
                ids.map(id => ({
                    stockId: id,
                    nodeId
                }))
            ))
        )

    }

    /**
     * 
     * @param params 
     */

    async handleLotsCreated(
        params : LotsCreatedParam
    ){

        for(const param of params){

            const {
                stockItemId,
                quantity
            } = param;

            await this.service.addUnit(
                stockItemId,
                {
                    quantity,
                    remaining : quantity
                }
            );

        }

    }

    async handleLotUnitUpdated(
        param : LotUnitUpdatedParam
    ){

        const {
            id : lotId,
            ...rest
        } = param;

        const {id} = await this.query.findByLotId(lotId);

        await this.service.updateUnitData(
            id,
            rest
        )

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @returns 
     */

    private async getNodesId(){
        const projectId = this.authContext.userProject;
        const nodes = await this.nodeFinder.findByProjectId(projectId);
    
        return nodes.map(({id}) => id);
    }

}