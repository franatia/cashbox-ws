import { In } from "typeorm";
import { NodeQuery } from "./node.query";
import { BaseFinder } from "@/common/models/crud/query/base-finder.crud";
import { Node } from "@/project/entities/node.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NodeFinder extends BaseFinder<
    Node,
    NodeQuery
> {

    constructor(
        query : NodeQuery
    ){
        super(query);
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    findById(
        id : string
    ){
        return this.findOneOrFail({
            where : {
                id
            }
        })
    }

    /**
     * 
     * @param projectId 
     * @returns 
     */

    findByProjectId(
        projectId : string
    ){
        return this.findMany({
            where : {
                project : {
                    id : projectId
                }
            }
        })
    }

    /**
     * 
     * @param id 
     * @param projectId 
     * @returns 
     */

    existsByProject(
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
     * @param ids 
     * @param projectId 
     * @returns 
     */

    countInProject(
        ids : string[],
        projectId : string
    ){
        return this.count({
            id : In(ids),
            project : {
                id : projectId
            }
        })
    }

}