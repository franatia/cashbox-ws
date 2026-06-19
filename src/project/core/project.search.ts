import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { ProjectQuery } from "./query/project.query";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { Brackets, SelectQueryBuilder } from "typeorm";
import { SearchParams } from "./types/params/search.param";
import { AuthContext } from "@/auth/auth.context";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class ProjectSearch extends BaseSearch {

    constructor(
        private readonly query: ProjectQuery,

        private readonly authContext: AuthContext
    ) {
        super()
     }

    protected applyJoins(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<any>
    ): void {

        query.innerJoin(
            `${alias}.owner`,
            "owner"
        ).leftJoin(
            `${alias}.collaborators`,
            "coll"
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
            ...rest
        } = params;

        const {
            searchText,
            ...parameters
        } = rest;

        const {
            id,
            ownerId
        } = parameters;

        query.where(
            new Brackets(
                qb => {
                    qb.where(
                        `${alias}.ownerId = :clientId`,
                        {
                            clientId: this.authContext.userClient
                        }
                    ).orWhere(
                        "coll.userId = :clientId",
                        {
                            clientId: this.authContext.userClient
                        }
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

        if (ownerId) {
            query.andWhere(
                `${alias}.ownerId = :ownerId`
            ,
                {
                    ownerId
                }
            )
        }

        if (searchText) {
            this.applySearchTextFilter(
                alias,
                query,
                searchText
            )
         }else{

            query.orderBy(
                `${alias}.createdAt`,
                "DESC"
            )

         }

        query.distinct(true)
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
                    "name",
                    "createdAt"
                ]
            ),
            ...makeSelectors(
                "owner",
                [
                    "id",
                    "username",
                    "email"
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
        );

        return query.getMany();

    }

    get(
        params: SearchParams
    ): Promise<any[]> {

        return this.search(
            "project",
            params
        )

    }

    async getById(id: string): Promise<any> {

        const raw = await this.get({
            id,
            skip: 0,
            take: 1
        });

        if (!raw.length) {

            throw new BadRequestException(
                "Project was not found"
            );

        }

        return raw[0];

    }

}