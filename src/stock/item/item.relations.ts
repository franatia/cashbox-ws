import { Injectable } from "@nestjs/common";
import {BaseRelations} from "@/common/models/crud/base-relations.crud";
import { Item } from "../entities/item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ItemQuery } from "./item.query";
import { ItemFinder } from "./query/item.finder";

@Injectable()
export class ItemRelations extends BaseRelations<
    Item,
    ItemQuery,
    ItemFinder
> {

    constructor(
        finder : ItemFinder
    ) {
        super(finder);
    }

    linkedToProject(
        id: string,
        projectId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            {
                id,
                stock: {
                    project: {
                        id: projectId
                    }
                }
            },
            "Stock item is not linked with project",
            throwable
        );

    }

    linkedToNode(
        id : string,
        nodeId : string,
        throwable : boolean = true
    ){
        return this.linkedTo(
            {
                id,
                node : {
                    id : nodeId
                }
            },
            "Stock item is not linked with node",
            throwable
        )
    }

    linkedToProductItem(
        id: string,
        productItemId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            {
                id,
                stock: {
                    productItem: {
                        id: productItemId
                    }
                }
            },
            "Stock item is not linked with product item",
            throwable
        );

    }

    linkedToStock(
        id: string,
        stockId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            {
                id,
                stock: {
                    id: stockId
                }
            },
            "Stock item is not linked with stock",
            throwable
        );

    }

}