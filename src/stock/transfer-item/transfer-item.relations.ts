import {BaseRelations} from "@/common/models/crud/base-relations.crud";
import { InjectRepository } from "@nestjs/typeorm";
import { TransferItem } from "../entities/transfer/transfer-item.entity";
import { Brackets, Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { TransferItemQuery } from "./transfer-item.query";
import { TransferItemFinder } from "./query/transfer-item.finder";

@Injectable()
export class TransferItemRelations extends BaseRelations<
    TransferItem,
    TransferItemQuery,
    TransferItemFinder
> {

    constructor(
        finder : TransferItemFinder
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
                transfer: {
                    project: {
                        id: projectId
                    }
                }
            },
            "Transfer item is not linked with project",
            throwable
        );

    }

    linkedToTransfer(
        id: string,
        transferId: string,
        throwable: boolean = true
    ) {
        return this.linkedTo(
            {
                id,
                transfer: {
                    id: transferId
                }
            },
            "Transfer item is not linked with transfer",
            throwable
        );
    }

    linkedToProductItem(
        id: string,
        productItemId: string,
        throwable : boolean = true
    ) {
        return this.linkedTo(
            {
                id,
                productItem: {
                    id: productItemId
                }
            },
            "Transfer item is not linked with product item",
            throwable
        );
    }

    async linkedToNode(
        id: string,
        nodeId: string,
        throwable: boolean = true
    ) {

        const alias = "transferItem";

        const exists = await this.finder.query.repo.createQueryBuilder(
            alias
        ).innerJoin(
            `${alias}.transfer`,
            "transfer"
        ).where(
            `${alias}.id = :id`
        ).andWhere(
            new Brackets(qb => {
                qb.where(
                    "transfer.sourceNodeId = :nodeId"
                ).orWhere(
                    "transfer.targetNodeId = :nodeId"
                )
            })
        ).setParameters({
            id,
            nodeId
        }).getExists();

        if (!exists && throwable) {
            throw new BadRequestException(
                "Transfer item is not linked with node"
            )
        }

        return exists;

    }

    linkedToSourceNode(
        id: string,
        sourceNodeId: string,
        throwable: boolean = true
    ) {
        return this.linkedTo(
            {
                id,
                transfer : {
                    sourceNode : {
                        id : sourceNodeId
                    }
                }
            },
            "Transfer item is not linked with source node",
            throwable
        )
    }

    linkedToTargetNode(
        id : string,
        targetNodeId : string,
        throwable : boolean = true
    ){
        return this.linkedTo(
            {
                id,
                transfer : {
                    targetNode : {
                        id : targetNodeId
                    }
                }
            },
            "Transfer item is not linked with target node",
            throwable
        );
    }

}