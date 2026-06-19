import { BaseFinder } from "@/common/models/crud/query/base-finder.crud";
import { Lot } from "@/stock/entities/lot/lot.entity";
import { LotQuery } from "../lot.query";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LotFinder extends BaseFinder<
    Lot,
    LotQuery
>{
    constructor(
        query : LotQuery
    ){
        super(query);
    }
}