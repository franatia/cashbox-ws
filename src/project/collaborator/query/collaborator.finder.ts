import { Injectable } from "@nestjs/common";
import { ExistsByContextParams } from "../types/params/query.param";
import { CollaboratorQuery } from "./collaborator.query";
import { isUUID } from "class-validator";
import { FindOptionsWhere, IsNull } from "typeorm";
import { Collaborator } from "@/project/entities/collaborator.entity";
import { BaseFinder } from "@/common/models/crud/query/base-finder.crud";

@Injectable()
export class CollaboratorFinder extends BaseFinder<
    Collaborator,
    CollaboratorQuery
> {

    constructor(
        query: CollaboratorQuery
    ) { 
        super(query);
    }

    /**
         * 
         * EXISTS
         * 
         */

    /**
     * 
     * @param params 
     * @returns 
     */

    existsByNullableContext(
        params: ExistsByContextParams
    ) {

        const {
            projectId,
            userId,
            nodeId
        } = params;

        return this.exists({
            user: {
                id: userId
            },
            project: (
                isUUID(projectId)
            ) ? {
                id: projectId
            } : IsNull(),
            node: (
                isUUID(nodeId)
            ) ? {
                id: nodeId
            } : IsNull()
        })

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    existsByContext(
        params: ExistsByContextParams
    ) {

        const {
            projectId,
            userId,
            nodeId
        } = params;

        const queryParams : FindOptionsWhere<Collaborator> = {
            user : {
                id : userId
            }
        }

        if(isUUID(nodeId)){
            queryParams.node = {
                id : nodeId
            }
        }

        if(isUUID(projectId)){
            queryParams.project = {
                id : projectId
            }
        }

        return this.exists(
            queryParams
        )

    }

    /**
     * 
     * @param userId 
     * @param projectId 
     */

    existsByProjectId(
        id : string,
        projectId : string
    ){

        return this.exists({
            id,
            project : {
                id : projectId
            }
        })

    }

    /**
     * 
     * @param id 
     * @param nodeId 
     * @returns 
     */

    existsByNodeId(
        id : string,
        nodeId : string
    ){

        return this.exists({
            id,
            node : {
                id : nodeId
            }
        })

    }

    /**
     * 
     * @param id 
     * @param userId 
     * @returns 
     */

    existsByUserId(
        id : string,
        userId : string
    ){
        return this.exists({
            id,
            user : {
                id : userId
            }
        })
    }

}