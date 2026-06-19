import { BaseFinder } from "@/common/models/crud/query/base-finder.crud";
import { Item } from "@/stock/entities/item.entity";
import { ItemQuery } from "../item.query";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ItemFinder extends BaseFinder<
    Item,
    ItemQuery
>{
    
    constructor(
        query : ItemQuery
    ){
        super(query);
    }

}