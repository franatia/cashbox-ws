import { BadRequestException } from "@nestjs/common";
import { MovementQuery } from "./movement.query";

export class MovementRelations {

    constructor(
        private readonly query : MovementQuery
    ){}

    /**
     * 
     * @param id 
     * @param projectId 
     * @param throwable 
     */

    async linkedToProject(
        id : string,
        projectId : string,
        throwable : boolean = true
    ){

        const exists = await this.query.exists({
            id,
            stockItem : {
                stock : {
                    project : {
                        id : projectId
                    }
                }
            }
        })

        if(!exists && throwable){
            throw new BadRequestException(
                "Movement is not linked with project"
            )
        }

        return exists;

    }

    /**
     * 
     * @param id 
     * @param nodeId 
     * @param throwable 
     */

    async linkedToNode(
        id : string,
        nodeId : string,
        throwable : boolean = true
    ){

        const exists = await this.query.exists({
            id,
            stockItem : {
                node : {
                    id : nodeId
                }
            }
        })

        if(!exists && throwable){
            throw new BadRequestException(
                "Movement is not linked with node"
            )
        }
        
        return exists;

    }

    /**
     * 
     * @param id 
     * @param userId 
     * @param throwable 
     * @returns 
     */

    async linkedToUser(
        id : string,
        userId : string,
        throwable : boolean = true
    ){

        const exists = await this.query.exists({
            id,
            createdBy : {
                id : userId
            }
        })

        if(!exists && throwable){
            throw new BadRequestException(
                "Movement is not linked with user"
            )
        }

        return exists;

    }

    /**
     * 
     * @param id 
     * @param lotId 
     * @param throwable 
     * @returns 
     */

    async linkedToLot(
        id : string,
        lotId : string,
        throwable : boolean = true
    ){

        const exists = await this.query.exists({
            id,
            lot : {
                id : lotId
            }
        })

        if(!exists && throwable){
            throw new BadRequestException(
                "Movement is not linked with lot"
            )
        }

        return exists;

    }
    
    /**
     * 
     * @param id
     * @param stockItemId 
     * @param throwable 
     * @returns 
     */

    async linkedToStockItem(
        id : string,
        stockItemId : string,
        throwable : boolean = true
    ){

        const exists = await this.query.exists({
            id,
            stockItem : {
                id : stockItemId
            }
        })

        if(!exists && throwable){
            throw new BadRequestException(
                "Movement is not linked with stock item"
            )
        }

        return exists;

    }

    /**
     * 
     * @param id 
     * @param stockId 
     * @param throwable 
     * @returns 
     */

    async linkedToStock(
        id : string,
        stockId : string,
        throwable : boolean = true
    ){

        const exists = await this.query.exists({
            id,
            stockItem : {
                stock : {
                    id : stockId
                }
            }
        })

        if(!exists && throwable){
            throw new BadRequestException(
                "Movement is not linked with stock"
            )
        }

        return exists;

    }

    /**
     * 
     * @param id 
     * @param transferItemId 
     * @param throwable 
     * @returns 
     */

    async linkedToTransferItem(
        id : string,
        transferItemId : string,
        throwable : boolean = true
    ){

        const exists = await this.query.exists({
            id,
            transferItem : {
                id : transferItemId
            }
        })

        if(!exists && throwable){
            throw new BadRequestException(
                "Movement is not linked with transfer item"
            )
        }

        return exists;

    }

    /**
     * 
     * @param id 
     * @param transferId 
     * @param throwable 
     * @returns 
     */

    async linkedToTransfer(
        id : string,
        transferId : string,
        throwable : boolean = true
    ){
        const exists = await this.query.exists({
            id,
            transferItem : {
                transfer : {
                    id : transferId
                }
            }
        })

        if(!exists && throwable){
            throw new BadRequestException(
                "Movement is not linked with transfer"
            )
        }

        return exists;
    }


}