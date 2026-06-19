import { Injectable } from "@nestjs/common";
import { In, Repository } from "typeorm";
import {BaseRelations} from "@/common/models/crud/base-relations.crud";
import { Lot } from "../entities/lot/lot.entity";
import { LotQuery } from "./lot.query";
import { LotFinder } from "./query/lot.finder";

@Injectable()
export class LotRelations extends BaseRelations<
    Lot,
    LotQuery,
    LotFinder
> {

    constructor(
        finder : LotFinder
    ) {
        super(finder);
    }

    /**
     * 
     * @param id 
     * @param projectId 
     * @param throwable 
     * @returns 
     */

    async linkedToProject(
        id: string,
        projectId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            {
                id,
                stockItem: {
                    stock: {
                        project: {
                            id: projectId
                        }
                    }
                }
            },
            "Lot is not linked with project",
            throwable
        );

    }

    /**
     * 
     * @param id 
     * @param nodeId 
     * @param throwable 
     * @returns 
     */

    linkedToNode(
        id : string,
        nodeId : string,
        throwable : boolean = true
    ){
        return this.linkedTo(
            {
                id,
                stockItem: {
                    node : {
                        id : nodeId
                    }
                }
            },
            "Lot is not linked with node",
            throwable
        );
    }

    /**
     * 
     * @param id 
     * @param productItemId 
     * @param throwable 
     * @returns 
     */

    async linkedToProductItem(
        id: string,
        productItemId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            {
                id,
                stockItem: {
                    stock: {
                        productItem: {
                            id: productItemId
                        }
                    }
                }
            },
            "Lot is not linked with product item",
            throwable
        );

    }

    /**
     * 
     * @param id 
     * @param stockItemId 
     * @param throwable 
     * @returns 
     */

    async linkedToStockItem(
        id: string,
        stockItemId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            {
                id,
                stockItem: {
                    id: stockItemId
                }
            },
            "Lot is not linked with stock item",
            throwable
        );

    }

    /**
     * 
     * @param ids 
     * @param stockItemId 
     * @param throwable 
     * @returns 
     */

    async manyLinkedToStockItem(
        ids: string[],
        stockItemId: string,
        throwable: boolean = true
    ) {

        return this.manyLinkedTo(
            {
                id: In(ids),
                stockItem: {
                    id: stockItemId
                }
            },
            ids.length,
            "Lot is not linked with stock item",
            throwable
        );

    }

    /**
     * 
     * @param id 
     * @param reserveId 
     * @param throwable 
     * @returns 
     */

    async linkedToReserve(
        id: string,
        reserveId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            {
                id,
                reserve: {
                    id: reserveId
                }
            },
            "Lot is not linked with stock item",
            throwable
        );

    }

    /**
     * 
     * @param id 
     * @param costSnapshotId 
     * @param throwable 
     * @returns 
     */

    async linkedToCostSnapshot(
        id: string,
        costSnapshotId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            {
                id,
                costSnapshot: {
                    id: costSnapshotId
                }
            },
            "Lot is not linked with stock item",
            throwable
        );

    }

}