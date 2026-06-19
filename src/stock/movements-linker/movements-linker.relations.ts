import {BaseRelations} from "@/common/models/crud/base-relations.crud";
import { MovementsLinker } from "../entities/transfer/movements-linker.entity";
import { Brackets } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import MovementsLinkerQuery from "./movements-linker.query";
import { MovementsLinkerFinder } from "./query/movements-linker.finder";

@Injectable()
export class MovementsLinkerRelations extends BaseRelations<
    MovementsLinker,
    MovementsLinkerQuery,
    MovementsLinkerFinder
> {

    constructor(
        finder : MovementsLinkerFinder
    ){
        super(finder);
    }

    linkedToProject(
        id : string,
        projectId:  string,
        throwable : boolean = true
    ){
        return this.linkedTo(
            {
                id,
                transferItem : {
                    transfer : {
                        project : {
                            id : projectId
                        }
                    }
                }
            },
            "Movements linker is not linked to project",
            throwable
        )
    }

    async linkedToNode(
        id : string,
        nodeId : string,
        throwable : boolean = true
    ){  
        const alias = "ml";
        const exists = await this.finder.query.repo.createQueryBuilder(
            alias
        ).innerJoin(
            `${alias}.transferItem`,
            "transferItem"
        ).innerJoin(
            "transferItem.transfer",
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
        ).setParameters(
            {
                id,
                nodeId
            }
        ).getExists();

        if(!exists && throwable){
            throw new BadRequestException(
                "Movements linker is not linked to node"
            );
        }

        return exists;
    };

    async linkedToMovement(
        id : string,
        movementId : string,
        throwable : boolean = true
    ){

        const alias = "ml";
        const exists = await this.finder.query.repo.createQueryBuilder(
            alias
        ).where(
            `${alias}.id = :id`
        ).andWhere(
            new Brackets(qb => {
                qb.where(
                    `${alias}.sourceMovementId = :movementId`
                ).orWhere(
                    `${alias}.targetMovementId = :movementId`
                )
            })
        ).setParameters(
            {
                id,
                movementId
            }
        ).getExists();


        if(!exists && throwable){
            throw new BadRequestException(
                "Movements linker is not linked to movement"
            )
        };

        return exists;

    }

    linkedToSourceMovement(
        id : string,
        movementId : string,
        throwable : boolean = true
    ){

        return this.linkedTo(
            {
                id,
                sourceMovement : {
                    id : movementId
                } 
            },
            "Movements linker is not linked with given source movement",
            throwable
        )

    }

    linkedToTargetMovement(
        id : string,
        movementId : string,
        throwable : boolean = true
    ){

        return this.linkedTo(
            {
                id,
                targetMovement : {
                    id : movementId
                }
            },
            "Movements linker is not linked with given target movement",
            throwable
        );

    }

    linkedToTransferItem(
        id : string,
        transferItemId : string,
        throwable : boolean = true
    ){
        return this.linkedTo(
            {
                id,
                transferItem : {
                    id : transferItemId
                }
            },
            "Movements linker is not linker to transfer item",
            throwable
        )
    }

    linkedToTransfer(
        id : string,
        transferId : string,
        throwable : boolean = true
    ){

        return this.linkedTo(
            {
                id,
                transferItem : {
                    transfer : {
                        id : transferId
                    }
                }
            },
            "Movements linker is not linked to transfer",
            throwable
        );

    }

}