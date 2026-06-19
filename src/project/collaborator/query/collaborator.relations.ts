import { BadRequestException, Injectable } from "@nestjs/common";
import { CollaboratorFinder } from "./collaborator.finder";
import { CollaboratorQuery } from "./collaborator.query";
import { Brackets } from "typeorm";
import {BaseRelations} from "@/common/models/crud/base-relations.crud";
import { Collaborator } from "../../entities/collaborator.entity";

@Injectable()
export class CollaboratorRelations extends BaseRelations<
    Collaborator,
    CollaboratorQuery,
    CollaboratorFinder
> {

    constructor(
        finder: CollaboratorFinder
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
            () => (
                this.finder.existsByProjectId(
                    id,
                    projectId
                )
            ),
            "Collaborator is not linked with project",
            throwable
        );

    }

    /**
     * 
     * @param userId 
     * @param projectId 
     * @param throwable 
     * @returns 
     */

    async userLinkedToProject(
        userId: string,
        projectId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            () => (
                this.finder.existsByContext({
                    userId,
                    projectId
                })
            ),
            "Collaborator user is not linked with project",
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

    async linkedToNode(
        id: string,
        nodeId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            () => (
                this.finder.existsByNodeId(
                    id,
                    nodeId
                )
            ),
            "Collaborator does not correspond toward node",
            throwable
        );

    }

    /**
     * 
     * @param userId 
     * @param nodeId 
     * @param throwable 
     * @returns 
     */

    async userLinkedToNode(
        userId: string,
        nodeId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            () => (
                this.finder.existsByContext({
                    userId,
                    nodeId
                })
            ),
            "Collaborator user does not correspond toward node",
            throwable
        );

    }

    /**
     * 
     * @param id 
     * @param userId 
     * @param throwable 
     * @returns 
     */

    async linkedToUser(
        id: string,
        userId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            () => (
                this.finder.existsByUserId(
                    id,
                    userId
                )
            ),
            "Collaborator is not linked to user",
            throwable
        );

    }

    /**
     * 
     * @param id 
     * @param usserId 
     * @param throwable 
     * @returns 
     */

    async notLinkedToUser(
        id: string,
        userId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            async () => {

                const exists = await this.finder.existsByUserId(
                    id,
                    userId
                );

                return !exists;

            },
            "Collaborator is linked with user",
            throwable
        );

    }

    /**
       * 
       * Verifica si el colaborador esta relacionado con el usuario, ya sea si:
       *  1. El usuario es propietario de un proyecto al que el colaborador pertenece.
       *  2. El usuario es colaborador del proyecto al que el colaborador pertenece.
       * 
       * @param collaboratorId 
       * @param userId 
       */

    async linkedToUserContext(
        id: string,
        userId: string,
        throwable: boolean = true
    ) {

        const alias = "coll";
        const qb = this.finder.query.createQueryBuilder("coll");

        qb.innerJoin(
            `${alias}.project`,
            "project",
        ).leftJoin(
            "project.collaborators",
            "projectColl",
            "projectColl.userId = :userId"
        )
        qb.where(
            `${alias}.id = :id`,
        ).andWhere(
            new Brackets(
                qb => {
                    qb.where(
                        "project.ownerId = :userId"
                    ).orWhere(
                        "projectColl.id IS NOT NULL"
                    )
                }
            )
        ).setParameters({
            id,
            userId
        })

        const isExists = await qb.getExists();

        if (!isExists && throwable) throw new BadRequestException("Collaborator does not correspond toward user");

        return isExists;

    }

}