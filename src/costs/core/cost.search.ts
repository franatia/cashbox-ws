import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Cost } from "../entities/cost.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { notObjectEmpty } from "@/common/helpers/object.helper";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { RuleSearch } from "../rule/rule.search";
import ItemSearch from "../item/item.search";
import { BadRequestException } from "@nestjs/common";
import { SearchParams } from "./types/params/search.params";

export default class CostSearch extends BaseSearch {

    constructor(
        @InjectRepository(Cost)
        private readonly repo: Repository<Cost>,

        private readonly ruleSearch: RuleSearch,
        private readonly itemSearch: ItemSearch
    ) {
        super()
    }

    protected applyJoins(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<Cost>
    ): void {
    }

    protected applyFilters(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<Cost>
    ): void {
        const {
            skip,
            take,
            access,
            id,
            searchText,
            projectId
        } = params;

        query.where("1=1");

        if (id) {
            query.andWhere(`${alias}.id = :id`, {
                id
            })
        }

        if (searchText) {
            this.applySearchText(
                alias,
                searchText,
                query
            )
        } else {
            query.orderBy(`${alias}.createdAt`, "DESC")
        }

        if (projectId) {
            query.andWhere(`${alias}.projectId = :projectId`, {
                projectId
            })
        }

        if (access) {
            query.andWhere(`${alias}.access = :access`, {
                access
            })
        }

        query
            .distinct(true)
            .skip(skip)
            .take(take)
    }

    /**
     * 
     * @param alias 
     * @param searchText 
     * @param query 
     * @returns 
     */

    private applySearchText(
        alias: string,
        searchText: string,
        query: SelectQueryBuilder<Cost>
    ) {
        const normalizedSearch = searchText.trim();

        if (!normalizedSearch) return;

        query.andWhere(
            `unaccent(${alias}.name) ILIKE unaccent(:searchText)`,
            {
                searchText: `%${normalizedSearch}%`
            }
        );

        query.addSelect(`
            CASE
                WHEN unaccent(${alias}.name) ILIKE unaccent(:exactSearch) THEN 1
                WHEN unaccent(${alias}.name) ILIKE unaccent(:startsSearch) THEN 2
                ELSE 3
            END
        `, "search_rank");

        query.orderBy("search_rank", "ASC");

        query.setParameters({
            exactSearch: normalizedSearch,
            startsSearch: `${normalizedSearch}%`
        });
    }

    /**
     * 
     * @param alias 
     * @param params 
     * @param query 
     */

    protected applySelectors(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<Cost>
    ) {
        query.loadAllRelationIds({
            relations: ["project"]
        })
            .select(
                makeSelectors(
                    alias,
                    [
                        "id",
                        "createdAt",
                        "name",
                        "access"
                    ]
                )
            )
    }

    /**
     * 
     * @param alias 
     * @param params 
     * @returns 
     */

    protected search(
        alias: string,
        params: SearchParams
    ) {
        const query = this.repo.createQueryBuilder(alias);

        this.applySelectors(
            alias,
            params,
            query
        );
        this.applyFilters(
            alias,
            params,
            query
        );

        return query.getMany();
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    get(params: SearchParams) {

        notObjectEmpty(params);

        return this.search("cost", params);

    }

    /**
     * 
     * @param id 
     * @returns 
     */

    async getById(id: string) {

        const cost = await this.findCostOrFail(
            id
        )

        const rules = await this.ruleSearch.get({
            costId: id,
            skip: 0,
            take: 99
        })

        const items = await this.itemSearch.get({
            costId: id,
            skip: 0,
            take: 4
        })

        return this.repo.merge(
            new Cost(),
            cost,
            {
                items,
                rules
            }
        )

    }

    /**
     * 
     * HELPERS
     * 
     */

    private async findCostOrFail(
        id : string
    ){
        const cost = await this.repo.createQueryBuilder(
            "cost"
        )
        .where("cost.id = :id",{
            id
        })
        .select(
            makeSelectors(
                "cost",
                [
                    "id",
                    "createdAt",
                    "name",
                    "access"
                ]
            )
        )
        .getOne();

        if(!cost){
            throw new BadRequestException(
                "Cost does not exists"
            );
        }

        return cost;
    }

}