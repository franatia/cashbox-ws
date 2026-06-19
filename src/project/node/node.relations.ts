import { BadRequestException, Injectable } from "@nestjs/common";
import { NodeFinder } from "./query/node.finder";

@Injectable()
export class NodeRelations {

    constructor(
        private readonly finder: NodeFinder
    ) { }

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

        const isExists = await this.finder.existsByProject(
            id,
            projectId
        )

        if (!isExists && throwable) {

            throw new BadRequestException(
                "Node is not linked with project"
            );

        }

        return isExists;

    }

    /**
     * 
     * @param ids 
     * @param projectId 
     * @param throwable 
     * @returns 
     */

    async manyLinkedToProject(
        ids: string[], 
        projectId: string, 
        throwable: boolean = true
    ) {
    
        const count = await this.finder.countInProject(
            ids,
            projectId
        );
    
        const condition = count === ids.length;
    
        if (!condition && throwable){

            throw new BadRequestException(
                "All nodes are not linked with project"
            );

        }
    
        return condition;
    
      }

}