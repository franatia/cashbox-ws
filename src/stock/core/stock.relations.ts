import { BadRequestException, Injectable } from "@nestjs/common";
import { StockQuery } from "./query/stock.query";

@Injectable()
export class StockRelations {

    constructor(
        private readonly query : StockQuery
    ){}

    async linkedToProject(
        id : string,
        projectId : string,
        throwable : boolean = true
    ){
        const exists = await this.query.exists({
            id,
            project : {
                id : projectId
            }
        })

        if(!exists && throwable){
            throw new BadRequestException("Stock is not linked with project");
        }

        return exists;

    }

    async linkedToProductItem(
        id : string,
        productItemId : string,
        throwable : boolean = true
    ){
        const exists = await this.query.exists({
            id,
            productItem : {
                id  : productItemId
            }
        })
    
        if(!exists && throwable){
            throw new BadRequestException("Stock is not linked with product item");
        }
        
        return exists;

    }
    
}