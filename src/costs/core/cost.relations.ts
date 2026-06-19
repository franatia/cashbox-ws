import { BadRequestException, Injectable } from "@nestjs/common";
import CostQuery from "./cost.query";

@Injectable()
export class CostRelations {
    
    constructor(
        private readonly query : CostQuery
    ){}

    /**
     * 
     * LINKERS
     * 
     */

    async linkedToProject(
        id: string,
        projectId: string,
        throwable: boolean = true
    ) {

        const exists = await this.query.exists({
            id,
            project: {
                id: projectId
            }
        })

        if (!exists && throwable) {
            throw new BadRequestException("Cost is not linked with project");
        }

        return exists;

    }

    /**
     * 
     * @param id 
     * @param productItemId 
     * @param throwable 
     */

    async linkedToProductItem(
        id : string,
        productItemId : string,
        throwable = true
    ){

        const exists = await this.query.exists({
            productItems : {
                id : productItemId
            },
            id
        });

        if (!exists && throwable) {
            throw new BadRequestException("Cost is not linked with product item");
        }

        return exists;

    }

}