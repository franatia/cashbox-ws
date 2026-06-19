import { BaseFinder } from "@/common/models/crud/query/base-finder.crud";
import { Transfer } from "@/stock/entities/transfer/transfer.entity";
import { TransferQuery } from "../transfer.query";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransferFinder extends BaseFinder<
    Transfer,
    TransferQuery
>{

    constructor(
        query : TransferQuery
    ){
        super(query);
    }

}