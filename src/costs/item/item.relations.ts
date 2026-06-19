import { BadRequestException, Injectable } from "@nestjs/common";
import ItemQuery from "./item.query";
import { In } from "typeorm";

@Injectable()
export class ItemRelations {

    constructor(
        private readonly query: ItemQuery
    ) { }

    /**
         * 
         * LINKERS
         * 
         */

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

        const exists = await this.query.exists({
            id,
            cost: {
                project: {
                    id: projectId
                }
            }
        })

        if (!exists && throwable) {
            throw new BadRequestException(
                "Cost item is not linked with project"
            )
        }

        return exists;

    }

    /**
     * 
     * @param itemsId 
     * @param costId 
     * @param throwable 
     * @returns 
     */

    async manyLinkedToCost(
        itemsId: string[],
        costId: string,
        throwable: boolean = true
    ) {

        const count = await this.query.count({
            id: In(itemsId),
            cost: {
                id: costId
            }
        })

        const exists = count === itemsId.length;

        if (!exists && throwable) {
            throw new BadRequestException(
                "Items are not linked with cost"
            )
        }

        return exists;

    }

}