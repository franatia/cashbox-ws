import { BaseSearch } from "@/common/models/crud/base-search.crud"
import { NodeQuery } from "./query/node.query";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { Brackets, SelectQueryBuilder } from "typeorm";
import { SearchParams } from "./types/param/search.param";
import { Node } from "../entities/node.entity";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { AuthContext } from "@/auth/auth.context";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NodeSearch extends BaseSearch {

    constructor(
        private readonly query: NodeQuery,

        private readonly authContext: AuthContext
    ) {
        super()
    }

    protected applyJoins(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<any>
    ): void {

        const {
            cashboxId
        } = params;

        query.leftJoin(
            `${alias}.collaborators`,
            "coll"
        ).innerJoin(
            `${alias}.project`,
            "project"
        ).leftJoin(
            "project.collaborators",
            "projColl"
        )

        if (cashboxId) {
            query.innerJoin(
                `${alias}.cashbox`,
                "cashbox"
            );
        }

    }

    protected applyFilters(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<any>
    ): void {

        const {
            skip,
            take,
            ...rest
        } = params;

        const {
            searchText,
            ...parameters
        } = rest;

        const {
            cashboxId,
            id,
            projectId
        } = parameters;

        query.where(
            new Brackets(
                qb => {
                    qb.where(
                        "project.ownerId = :clientId",
                        {
                            clientId: this.authContext.userClient
                        }
                    ).orWhere(
                        "coll.userId = :clientId",
                        {
                            clientId: this.authContext.userClient
                        }
                    ).orWhere(
                        new Brackets(
                            qb2 => {
                                qb2.where(
                                    "projColl.userId = :clientId",
                                    {
                                        clientId: this.authContext.userClient
                                    }
                                ).andWhere(
                                    "projColl.nodeId IS NULL"
                                )
                            }
                        )
                    )

                }
            )
        )

        if (id) {
            query.andWhere(
                `${alias}.id = :id`
                ,
                {
                    id
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

        if (cashboxId) {
            query.andWhere(
                "cashbox.id = :cashboxId"
                ,
                {
                    cashboxId
                }
            )
        }

        if (searchText) {

            this.applySearchTextFilter(
                alias,
                query,
                searchText
            );

        }

        query
            .distinct(true)
            .skip(skip)
            .take(take)

    }

    private applySearchTextFilter(
        alias: string,
        query: SelectQueryBuilder<Node>,
        searchText: string
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
                    "name"
                ]
            )
        ])

    }

    protected search(
        alias: string,
        params: SearchParams
    ): Promise<any[]> {

        const query = this.query.createQueryBuilder(alias);

        this.applySelectors(
            alias,
            params,
            query
        );

        this.applyJoins(
            alias,
            params,
            query
        );

        this.applyFilters(
            alias,
            params,
            query
        )

        return query.getMany();

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    get(params: SearchParams): Promise<any[]> {
        return this.search(
            "node",
            params
        )
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    getById(id: string): Promise<any> {

        const alias = "node";

        const query = this.query.createQueryBuilder(alias);

        return query.innerJoin(
            `${alias}.project`,
            "project"
        ).innerJoin(
            "project.owner",
            "owner"
        ).leftJoin(
            "project.collaborators",
            "projColl"
        ).leftJoin(
            `${alias}.collaborators`,
            "coll"
        ).where(
            new Brackets(
                qb => {
                    qb.where(
                        "project.ownerId = :clientId"
                    ).orWhere(
                        "coll.userId = :clientId"
                    ).orWhere(
                        new Brackets(
                            qb2 => {
                                qb2.where(
                                    "projColl.userId = :clientId"
                                ).andWhere(
                                    "projColl.nodeId IS NULL"
                                )
                            }
                        )
                    )

                }
            )
        ).andWhere(
            `${alias}.id = :id`
        ).select([
            ...makeSelectors(
                alias,
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
                "owner",
                [
                    "id",
                    "username",
                    "imageProfile"
                ]
            )
        ]).setParameters({
            id,
            clientId: this.authContext.userClient
        }).getOneOrFail()

    }

}