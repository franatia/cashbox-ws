import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { Repository, SelectQueryBuilder } from "typeorm";
import Constant from "../entities/constant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { notObjectEmpty } from "@/common/helpers/object.helper";
import { Injectable } from "@nestjs/common";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { SearchParams } from "./types/params/search.params";

@Injectable()
export default class ConstantSearch extends BaseSearch {

    constructor(
        @InjectRepository(Constant)
        private readonly repo: Repository<Constant>
    ) {
        super();
    }

    applyJoins(alias: string, params: BasicSearchParams, query: SelectQueryBuilder<any>): void {



    }

    applyFilters(alias: string, params: SearchParams, query: SelectQueryBuilder<any>): void {

        const {
            skip,
            take,
            id,
            projectId,
            searchText,
            tag,
        } = params;

        query.where("1=1");

        if (id) {
            query.andWhere(
                `${alias}.id = :id`,
                {
                    id
                }
            )
        }

        if (projectId) {
            query.andWhere(
                `${alias}.projectId = :projectId`,
                {
                    projectId
                }
            )
        }

        if (tag) {
            query.andWhere(
                `tag = ANY(${alias}.tags)`,
                {
                    tag
                }
            )
        }

        if (searchText) {
            this.applySearchFilter(
                alias,
                searchText,
                query
            )
        } else {
            query.orderBy(`${alias}.createdAt`, "DESC")
        }

        query
            .distinct(true)
            .skip(skip)
            .take(take);

    }

    applySearchFilter(
        alias: string,
        searchText: string,
        query: SelectQueryBuilder<Constant>
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

    applySelectors(alias: string, params: SearchParams, query: SelectQueryBuilder<any>): void {

        query.select(makeSelectors(
            alias,
            [
                "id",
                "createdAt",
                "name",
                "value",
                "tags"
            ]
        ))

    }

    search(alias: string, params: SearchParams) {
        const query = this.repo.createQueryBuilder(alias);

        this.applySelectors(alias, params, query);
        this.applyFilters(alias, params, query);

        return query.getMany();
    }

    get(params: SearchParams) {

        notObjectEmpty(params);

        return this.search("constant", params);
    }

    getById(id: string) {

        const alias = "constant";
        const query = this.repo.createQueryBuilder(alias)
            .leftJoin(`${alias}.project`, "project")
            .where(`${alias}.id = :id`, { id });

        query.select([
            ...makeSelectors(
                alias,
                [
                    "id",
                    "createdAt",
                    "name",
                    "value",
                    "tags"
                ]
            ),
            ...makeSelectors(
                "project",
                [
                    "id",
                    "createdAt",
                    "name"
                ]
            )
        ])

        return query.getOne();
    }

}