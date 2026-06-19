import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Stock } from "../entities/stock.entity";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { ItemSearch } from "../item/item.search";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StockSearch extends BaseSearch {

    constructor(
        @InjectRepository(Stock)
        private readonly repo : Repository<Stock>,

        private readonly itemSearch : ItemSearch
    ){
        super()
    }

    protected applyFilters(alias: string, params: BasicSearchParams, query: SelectQueryBuilder<any>): void {
        
    }

    protected applyJoins(alias: string, params: BasicSearchParams, query: SelectQueryBuilder<any>): void {
        
    }

    protected applySelectors(alias: string, params: BasicSearchParams, query: SelectQueryBuilder<any>): void {
        
    }

    protected async search(alias: string, params: BasicSearchParams): Promise<any[]> {
        return [];
    }

    async get(params: BasicSearchParams): Promise<any[]> {
        return [];
    }

    async getById(id: string): Promise<Stock> {
        
        const items = await this.itemSearch.get({
            stockId : id,
            skip : 0,
            take : 6
        });

        const alias = "stock";

        const stock = await this.repo.createQueryBuilder(alias)
            .innerJoin(
                `${alias}.project`,
                "project"
            )
            .innerJoin(
                `${alias}.productItem`,
                "productItem"
            )
            .innerJoin(
                "productItem.product",
                "product"
            )
            .leftJoin(
                "productItem.featureValues",
                "fv"
            )
            .leftJoin(
                "fv.feature",
                "feature"
            )
            .where(
                `${alias}.id = :id`,
                {
                    id
                }
            )
            .select([
                ...makeSelectors(
                    alias,
                    [
                        "id",
                        "quantity"
                    ]
                ),
                ...makeSelectors(
                    "productItem",
                    [
                        "id",
                        "name",
                        "sku"
                    ]
                ),
                ...makeSelectors(
                    "product",
                    [
                        "id",
                        "name",
                        "description",
                        "slug",
                        "subtractType"
                    ]
                ),
                ...makeSelectors(
                    "fv",
                    [
                        "id",
                        "value"
                    ]
                ),
                ...makeSelectors(
                    "feature",
                    [
                        "id",
                        "name"
                    ]
                )
            ]).getOneOrFail();

        return {
            ...stock,
            items
        }

    }

}