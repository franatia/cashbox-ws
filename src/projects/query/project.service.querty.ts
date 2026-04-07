import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { Project } from "../entities/project.entity";
import { WhereExpressionBuilder } from "typeorm/browser";
import { CollaboratorRole } from "../entities/collaborator.entity";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { Node } from "../entities/node.entity";
import { InjectRepository } from "@nestjs/typeorm";

export enum ParticipationFilter {

    ALL = "ALL", // Projects where user is either owner or collaborator
    COLLABORATOR = "COLLABORATOR", // Projects where user is a collaborator (regardless of role)
    OWNER = "OWNER" // Projects where user is the owner

}

@Injectable()
export class ProjectServiceQuery {

    constructor(
        @InjectRepository(Project)
        private readonly projectRepo: Repository<Project>,
        
        @InjectRepository(Node)
        private readonly nodeRepo: Repository<Node>
    ) { }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * Filtra los colaboradores que coincidan con el userId
     * 
     * @param qb 
     * @param userId 
     */

    private applyProjectCollaboratorAccess(
        qb: SelectQueryBuilder<Project> | WhereExpressionBuilder,
        userId: string
    ) {
        qb.andWhere("collaborator.userId = :userId", { userId });
    }

    /**
     * 
     * Filtra si el usuario es propietario  del proyecto
     * 
     * @param qb 
     * @param userId 
     */

    private applyProjectOwnerAccess(
        qb: SelectQueryBuilder<Project> | WhereExpressionBuilder,
        userId: string
    ) {
        qb.andWhere("project.ownerId = :userId", { userId })
    }

    /**
     * 
     * Aplica el filtro de participacion a los nodos
     * 
     * @param qb 
     * @param userId 
     * @param filter 
     * @param selectCollaborators 
     * @param nodeSelector 
     */

    private applyParticipationFilterToNode(
        qb: SelectQueryBuilder<Project>,
        userId: string,
        filter: ParticipationFilter,
        selectCollaborators : boolean = false,
        nodeSelector?: string,
    ) {
        qb.leftJoinAndSelect("project.nodes", "node");

        if (nodeSelector) {
            qb.andWhere("node.id = :nodeSelector", { nodeSelector });
        }

        if(selectCollaborators){
            qb.leftJoinAndSelect(
                "node.collaborators",
                "nodeCollaborator"
            )
        }

        if (filter === ParticipationFilter.COLLABORATOR || filter === ParticipationFilter.ALL) {
            qb.andWhere(new Brackets(qb2 => {
                qb2.where("collaborator.nodeId IS NULL")
                    .orWhere("node.id = collaborator.nodeId");

                if (filter === ParticipationFilter.ALL) {
                    qb2.orWhere("project.ownerId = :userId", { userId });
                }
            }));
        }
    }

    /**
     * 
     * Aplica el filtro de participacion al proyecto
     * 
     * @param qb 
     * @param userId 
     * @param filter 
     */

    async applyParticipationFilterToProject(
        qb: SelectQueryBuilder<Project>,
        userId: string,
        filter: ParticipationFilter
    ) {
        if (filter === ParticipationFilter.OWNER) {
            this.applyProjectOwnerAccess(qb, userId);
        } else if (filter === ParticipationFilter.COLLABORATOR) {
            this.applyProjectCollaboratorAccess(qb, userId);
        } else if (filter === ParticipationFilter.ALL) {
            this.applyProjectOwnerAccess(qb, userId);
            qb.orWhere(new Brackets(qb2 => {
                this.applyProjectCollaboratorAccess(qb2, userId);
            }))
        }
    }

    /**
     * 
     * Aplica el filtro de participacion
     * 
     * @param qb 
     * @param userId 
     * @param filter 
     * @param selectCollaborators 
     * @param selectNodes 
     * @param nodeSelector 
     */

    async applyParticipationFilter(
        qb: SelectQueryBuilder<Project>,
        userId: string,
        filter: ParticipationFilter = ParticipationFilter.ALL,
        selectCollaborators : boolean = false,
        selectNodes : boolean = false,
        nodeSelector?: string,
    ) {

        this.applyParticipationFilterToProject(qb, userId, filter);

        if (selectNodes) {
            this.applyParticipationFilterToNode(qb, userId, filter, selectCollaborators, nodeSelector);
        }

    }

    /**
     * 
     * QUERY BUILDERS
     * 
     */

    
    /**
     * 
     * Crea el query builder de acceso al proyecto
     * 
     * @param projectId 
     * @param userId 
     * @param roles 
     * @param wholeProject 
     * @param throwable 
     * @returns 
     */

    async hasProjectAccess(projectId: string, userId: string, roles: CollaboratorRole[], wholeProject = true, throwable = true) {
        const qb = this.projectRepo
            .createQueryBuilder("project")
            .where("project.id = :projectId", { projectId });

        const ownerSub = qb.subQuery()
            .select("1")
            .from("projects", "p")
            .where("p.id = project.id")
            .andWhere("p.ownerId = :userId")
            .getQuery();

        const collabSubQb = qb.subQuery()
            .select("1")
            .from("collaborators", "c")
            .where("c.projectId = project.id")
            .andWhere("c.userId = :userId")
            .andWhere("c.role IN (:...roles)");

        if (wholeProject) {
            collabSubQb.andWhere("c.nodeId IS NULL");
        }

        const collabSub = collabSubQb.getQuery();

        qb.andWhere(
            new Brackets((qb2) => {
                qb2.where(`EXISTS (${ownerSub})`)
                    .orWhere(`EXISTS (${collabSub})`);
            })
        );

        const isExists = await qb
            .setParameters({ userId, roles })
            .getExists();

        if (!isExists && throwable) {
            throw new ForbiddenException("User does not have access to project");
        }

        return isExists;
    }

    /**
     * 
     * Crea el query builder de acceso al nodo
     * 
     * @param nodeId 
     * @param userId 
     * @param roles 
     * @param throwable 
     * @returns 
     */

    async hasNodeAccess(nodeId: string, userId: string, roles: CollaboratorRole[], throwable = true) {

        const qb = this.nodeRepo
            .createQueryBuilder("node")
            .where("node.id = :nodeId", { nodeId });

        const nodeCollaboratorSub = qb.subQuery()
            .select("1")
            .from("collaborators", "c")
            .innerJoin("c.user", "u")
            .where("c.nodeId = node.id")
            .andWhere("u.id = :userId")
            .andWhere("c.role IN (:...roles)")
            .getQuery();

        const ownerSub = qb.subQuery()
            .select("1")
            .from("projects", "project")
            .innerJoin("project.owner", "owner")
            .where("project.id = node.projectId")
            .andWhere("owner.id = :userId")
            .getQuery();

        const globalCollaboratorSub = qb.subQuery()
            .select("1")
            .from("collaborators", "c")
            .innerJoin("c.user", "u")
            .where("c.projectId = node.projectId")
            .andWhere("c.nodeId IS NULL")
            .andWhere("u.id = :userId")
            .andWhere("c.role IN (:...roles)")
            .getQuery();

        qb.andWhere(new Brackets(qb2 => {
            qb2.where(`EXISTS (${nodeCollaboratorSub})`)
                .orWhere(`EXISTS (${ownerSub})`)
                .orWhere(`EXISTS (${globalCollaboratorSub})`)
        }))

        const isExists = await qb.setParameters({
            userId,
            roles
        })
            .getExists();

        if (!isExists && throwable) throw new ForbiddenException("User does not have access to node");

        return isExists;

    }

    async getProjectsQueryBuilder(
        userId: string,
        filter: ParticipationFilter = ParticipationFilter.ALL,
        selectCollaborators = false,
        selectNodes = false,
        nodeSelector?: string,
        initialBuilder?: SelectQueryBuilder<Project>
    ) {

        const qb = (initialBuilder ?? this.projectRepo.createQueryBuilder("project"))
            .leftJoin(
                "project.collaborators",
                "collaborator",
                "collaborator.userId = :userId",
                { userId }
            )
            .innerJoinAndSelect(
                "project.owner",
                "owner"
            );

        this.applyParticipationFilter(qb, userId, filter, selectCollaborators, selectNodes, nodeSelector);


        if (selectCollaborators) {
            qb.leftJoinAndSelect("project.collaborators", "projectCollaborator")
                .leftJoinAndSelect("projectCollaborator.user", "collaboratorUser")
        }

        return qb;
    }

}