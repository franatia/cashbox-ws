import { FindManyOptions, MoreThan } from "typeorm";
import { StockQuery } from "./stock.query";
import { Stock } from "@/stock/entities/stock.entity";
import { ProjectCursorPaginationParams } from "../types/params/pagination.params";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StockPagination {
    constructor(
        private readonly query: StockQuery
    ) { }

    /**
    * 
    * @param params 
    * @returns 
    */

    projectCursorPagination(
        params: ProjectCursorPaginationParams
    ) {

        const {
            projectId,
            lastId,
            take
        } = params;

        const options: FindManyOptions<Stock> = {
            where: {
                ...(lastId && {
                    id: MoreThan(lastId)
                }),
                project: {
                    id: projectId
                }
            },
            order: {
                id: "ASC"
            },
            take
        };

        return this.query.findMany(options);

    }
}