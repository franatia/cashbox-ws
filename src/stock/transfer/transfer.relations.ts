import { BaseRelations } from "@/common/models/crud/base-relations.crud";
import { Transfer } from "../entities/transfer/transfer.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { TransferQuery } from "./transfer.query";
import { TransferFinder } from "./query/transfer.finder";

@Injectable()
export class TransferRelations extends BaseRelations<
    Transfer,
    TransferQuery,
    TransferFinder
> {

    constructor(
        finder : TransferFinder
    ) {
        super(
            finder
        );
    }

    /**
     * 
     * @param id 
     * @param projectId 
     * @param throwable 
     * @returns 
     */

    linkedToProject(
        id: string,
        projectId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            {
                id,
                project: {
                    id: projectId
                }
            },
            "Transfer is not linked with project",
            throwable
        );

    }

    linkedToSourceNode(
        id: string,
        nodeId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            {
                id,
                sourceNode: {
                    id: nodeId
                }
            },
            "Transfer is not linked with source node",
            throwable
        )

    }

    linkedToTargetNode(
        id: string,
        nodeId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            {
                id,
                sourceNode: {
                    id: nodeId
                }
            },
            "Transfer is not linked with target node",
            throwable
        )

    }

    async linkedToNode(
        id: string,
        nodeId: string,
        throwable: boolean = true
    ) {

        const alias = "transfer";
        const exists = await this.finder.query.repo.createQueryBuilder(
            alias
        ).where(
            `${alias}.id = :id`
        ).andWhere(
            new Brackets(qb => {
                qb.where(
                    `${alias}.sourceNodeId = :nodeId`
                ).orWhere(
                    `${alias}.targetNodeId = :nodeId`
                )
            })
        ).setParameters(
            {
                id,
                nodeId
            }
        ).getExists();

        if (!exists && throwable) {
            throw new BadRequestException(
                "Transfer is not linked with node"
            );
        }

        return exists;

    }

    linkedToUser(
        id: string,
        userId: string,
        throwable: boolean = true
    ) {
        return this.linkedTo(
            {
                id,
                createdBy: {
                    id: userId
                }
            },
            "Transfer is not linked with given user creators",
            throwable
        )
    }

}