import { AuthContext } from "@/auth/auth.context";
import { StockPagination } from "../query/stock.pagination";
import { EventListenerService } from "@/event-listener/event-listener.service";
import { ItemService } from "../../item/item.service";
import { EventNames } from "@/event-listener/enum/events.enum";
import { NodeCreatedParam, ProductItemsCreatedParam, StockItemUnitUpdatedParam } from "@/event-listener/types/params/listeners.param";
import { StockService } from "../stock.service";
import { BaseListener } from "@/common/models/crud/base-listener.crud";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { StockQuery } from "../query/stock.query";

@Injectable()
export class StockListener implements BaseListener {

    constructor(
        private readonly service : StockService,
        private readonly query : StockQuery,
            
        private readonly pagination : StockPagination,
        private readonly itemService : ItemService,

        private readonly authContext : AuthContext,

        @Inject(forwardRef(() => EventListenerService))
        private readonly eventListener : EventListenerService
    ){}

    onModuleInit() {
        this.subscribeEvents()
    }

    subscribeEvents(){

        this.eventListener.set(
            EventNames.NODE_CREATED,
            ids => this.handleNodeCreated(ids)
        )

        this.eventListener.set(
            EventNames.PRODUCT_ITEMS_CREATED,
            ids => this.handleProductItemsCreated(ids)
        )

        this.eventListener.set(
            EventNames.STOCK_ITEM_UNIT_UPDATED,
            param => this.handleStockItemUnitUpdated(param)
        )

    }
    
    /**
     * 
     * HANDLERS
     * 
     */

    /**
     * 
     * @param nodeId 
     */

    async handleNodeCreated(
        nodeId : NodeCreatedParam
    ){

        const projectId = this.authContext.userProject;

        const take = 1000;
        let lastId : string | undefined = undefined;

        let total = 0;

        while (true) {

            const stocks = await this.pagination.projectCursorPagination({
                projectId,
                take,
                lastId
            })

            if(!stocks.length) break;

            await this.itemService.createMany(
                stocks.map(
                    ({ id }) => ({
                        stockId : id,
                        nodeId
                    })
                )
            );

            total += stocks.length;

            if(stocks.length < take) break;

            lastId = stocks.at(-1)?.id;

        }

    }

    /**
     * 
     * @param productItemsId 
     */

    async handleProductItemsCreated(
        productItemsId : ProductItemsCreatedParam
    ){

        const projectId = this.authContext.userProject;

        await this.service.createMany(
            productItemsId.map(
                id => ({
                    productItemId : id,
                    projectId 
                })
            )
        );

    }

    /**
     * 
     * @param param 
     * @returns 
     */

    async handleStockItemUnitUpdated(
        param : StockItemUnitUpdatedParam
    ){

        const {
            id : itemId,
            ...rest
        } = param;

        const {id} = await this.query.findByItemId(itemId);

        await this.service.updateUnitData(
            id,
            rest
        )

    }

}