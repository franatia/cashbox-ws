import { BaseFinder } from "@/common/models/crud/query/base-finder.crud";
import { MovementsLinker } from "@/stock/entities/transfer/movements-linker.entity";
import MovementsLinkerQuery from "../movements-linker.query";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MovementsLinkerFinder extends BaseFinder<
    MovementsLinker,
    MovementsLinkerQuery
>{

    constructor(
        query : MovementsLinkerQuery
    ){
        super(query);
    }

}