import { BaseFinder } from "@/common/models/crud/query/base-finder.crud";
import { TransferItem } from "@/stock/entities/transfer/transfer-item.entity";
import { TransferItemQuery } from "../transfer-item.query";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransferItemFinder extends BaseFinder<
    TransferItem,
    TransferItemQuery
>{
    
    constructor(
        query : TransferItemQuery
    ){
        super(query);
    }

}