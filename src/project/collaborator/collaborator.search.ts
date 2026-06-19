import { BaseSearch } from "@/common/models/crud/base-search.crud";
import { CollaboratorQuery } from "./query/collaborator.query";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { SelectQueryBuilder } from "typeorm";
import { SearchParams } from "./types/params/search.param";
import { Collaborator } from "../entities/collaborator.entity";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CollaboratorSearch extends BaseSearch {

    constructor(
        private readonly query: CollaboratorQuery
    ) {
        super()
    }

    protected applyJoins(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<any>
    ): void {

        query.innerJoin(
            `${alias}.user`,
            "user"
        ).leftJoin(
            `${alias}.node`,
            "node"
        )

    }

    protected applyFilters(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<any>
    ): void {

        const {
            skip,
            take,
            ...parameters
        } = params;

        const {
            id,
            nodeId,
            projectId,
            role,
            searchText,
            userId
        } = parameters;

        query
            .where("1=1");

        if (id) {
            query.andWhere(
                `${alias}.id = :id`,
                {
                    id
                }
            )
        }

        if (nodeId) {
            query.andWhere(
                `${alias}.nodeId = :nodeId`,
                {
                    nodeId
                }
            )
        }

        if (projectId) {
            query.andWhere(
                `${alias}.projectId = :projectId`
            ,
                {
                    projectId
                }
            )
        }

        if (role) {
            query.andWhere(
                `${alias}.role = :role`
            ,
                {
                    role
                }
            )
        }

        if (userId) {
            query.andWhere(
                `${alias}.userId = :userId`
            ,
                {
                    userId
                }
            )
        }

        if (searchText) {
            this.applySearchTextFilter(
                query,
                searchText
            )
        } else {
            query.orderBy(
                `${alias}.createdAt`,
                "DESC"
            )
        }

        query
            .distinct(true)
            .skip(skip)
            .take(take);

    }

    private applySearchTextFilter(
        query: SelectQueryBuilder<Collaborator>,
        searchText: string
    ) {
        const normalizedSearch = searchText.trim();

        if (!normalizedSearch) return;

        query.andWhere(
            `(unaccent(user.username) ILIKE unaccent(:searchText)
                OR unaccent(user.email) ILIKE unaccent(:searchText))`,
            {
                searchText: `%${normalizedSearch}%`
            }
        );

        query.addSelect(`
                CASE
                    WHEN unaccent(user.username) ILIKE unaccent(:exactSearch) THEN 1
                    WHEN unaccent(user.email) ILIKE unaccent(:exactSearch) THEN 2
                    WHEN unaccent(user.username) ILIKE unaccent(:startsSearch) THEN 3
                    WHEN unaccent(user.email) ILIKE unaccent(:startsSearch) THEN 4
                    ELSE 5
                END
            `, "search_rank");

        query.orderBy("search_rank", "ASC");

        query.setParameters({
            exactSearch: normalizedSearch,
            startsSearch: `${normalizedSearch}%`
        });
    }

    protected applySelectors(
        alias: string,
        params: BasicSearchParams,
        query: SelectQueryBuilder<any>
    ): void {

        query.select([
            ...makeSelectors(
                alias,
                [
                    "id",
                    "role",
                    "createdAt"
                ]
            ),
            ...makeSelectors(
                "user",
                [
                    "id",
                    "username",
                    "email",
                    "imageProfile"
                ]
            ),
            ...makeSelectors(
                "node",
                [
                    "id",
                    "name"
                ]
            )
        ])

    }

    protected search(
        alias: string,
        params: SearchParams
    ): Promise<any[]> {

        const query = this.query.createQueryBuilder(
            alias
        );

        this.applySelectors(
            alias,
            params,
            query
        );

        this.applyJoins(
            alias,
            params,
            query
        )

        this.applyFilters(
            alias,
            params,
            query
        )

        return query.getMany();

    }

    get(
        params: SearchParams
    ): Promise<any[]> {

        return this.search(
            "coll",
            params
        );

    }

    async getById(id: string): Promise<any> {

        const alias = "coll";
        const query = this.query.createQueryBuilder(alias)
            .innerJoin(
                `${alias}.user`,
                "user"
            )
            .leftJoin(
                `${alias}.node`,
                "node"
            )
            .innerJoin(
                `${alias}.project`,
                "project"
            );

        return query.where(
            `${alias}.id = :id`,
            {
                id
            }
        ).select([
            ...makeSelectors(
                alias,
                [
                    "id",
                    "role"
                ]
            ),
            ...makeSelectors(
                "node",
                [
                    "id",
                    "name"
                ]
            ),
            ...makeSelectors(
                "project",
                [
                    "id",
                    "name"
                ]
            ),
            ...makeSelectors(
                "user",
                [
                    "id",
                    "username",
                    "imageProfile"
                ]
            )
        ]).getOneOrFail();


    }

}