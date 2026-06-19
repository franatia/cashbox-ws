import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "../entities/item.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { SearchParams } from "./types/params/search.types";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { notObjectEmpty } from "@/common/helpers/object.helper";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class ItemSearch extends BaseSearch {

    constructor(
        @InjectRepository(Item)
        private readonly repo: Repository<Item>
    ) {
        super()
    }

    /**
     * 
     * @param alias 
     * @param params 
     * @param query 
     */

    protected applyJoins(
        alias: string,
        params: Partial<SearchParams>,
        query: SelectQueryBuilder<any>
    ): void {
        const {
            projectId,
            rulesId,
        } = params;

        query.leftJoin(
            `${alias}.constant`,
            "constant"
        )
            .leftJoin(
                `${alias}.tax`,
                "tax"
            )

        if (projectId) {
            query.innerJoin(
                `${alias}.cost`,
                "cost"
            )
        }
        if (rulesId?.length) {
            query.innerJoin(
                `${alias}.rules`,
                "rule"
            )
        }
    }

    /**
     * 
     * @param alias 
     * @param params 
     * @param query 
     */

    protected applyFilters(
        alias: string,
        params: Partial<SearchParams>,
        query: SelectQueryBuilder<any>
    ): void {

        const {
            skip,
            take,
            constantId,
            costId,
            id,
            projectId,
            rulesId,
            tag,
            taxId,
            type,
            valueSource
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

        if (costId) {
            query.andWhere(
                `${alias}.costId = :costId`,
                {
                    costId
                }
            )
        }

        if (projectId) {
            query.andWhere(
                "cost.projectId = :projectId",
                {
                    projectId
                }
            )
        }

        if (constantId) {
            query.andWhere(
                `${alias}.constantId = :constantId`,
                {
                    constantId
                }
            )
        }

        if (taxId) {
            query.andWhere(
                `${alias}.taxId = :taxId`,
                {
                    taxId
                }
            )
        }

        if (rulesId?.length) {
            query.andWhere(
                "rule.id IN (:...rulesId)",
                {
                    rulesId
                }
            )
        }

        if (tag) {
            query.andWhere(
                `:tag = ANY(${alias}.tags)`,
                { tag }
            )
        }

        if (type) {
            query.andWhere(
                `${alias}.type = :type`,
                {
                    type
                }
            )
        }

        if (valueSource) {
            query.andWhere(
                `${alias}.valueSource = :valueSource`,
                {
                    valueSource
                }
            )
        }

        query
            .distinct(true)
            .orderBy(`${alias}.createdAt`, "DESC");

        if (skip) {
            query.skip(skip);
        }
        if (take) {
            query.take(take);
        }

    }

    /**
     * 
     * @param alias 
     * @param params 
     * @param query 
     */

    protected applySelectors(
        alias: string,
        params: Partial<SearchParams>,
        query: SelectQueryBuilder<any>
    ): void {

        query
            .select([
                ...makeSelectors(
                    alias,
                    [
                        "id",
                        "createdAt",
                        "name",
                        "type",
                        "valueSource",
                        "defaultValue",
                        "tags"
                    ]
                ),
                ...makeSelectors(
                    "constant",
                    [
                        "id",
                        "name",
                        "value"
                    ]
                ),
                ...makeSelectors(
                    "tax",
                    [
                        "id",
                        "alias",
                        "denomination",
                        "percentage",
                        "amount",
                        "valueType",
                        "jurisdiction"
                    ]
                )
            ])

    }

    /**
     * 
     * @param alias 
     * @param params 
     * @returns 
     */

    protected search(
        alias: string,
        params: Partial<SearchParams>
    ) {
        const query = this.repo.createQueryBuilder(alias);

        this.applySelectors(
            alias,
            params,
            query
        )

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

    /**
     * 
     * @param params 
     * @returns 
     */

    get(params: Partial<SearchParams>) {
        notObjectEmpty(params);

        return this.search(
            "item",
            params
        )
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    getById(
        id: string
    ) {

        return this.repo.findOne(
            {
                where: {
                    id
                },
                relations: {
                    constant: true,
                    tax: true
                }
            }
        )

    }

}