import { Injectable } from "@nestjs/common";
import { Item } from "../entities/item.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemQuery } from "./item.query";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { AuthContext } from "@/auth/auth.context";
import { Stock } from "@/stock/entities/stock.entity";

export type GetParams = {
    query?: string,
    projectId?: string,
    productId?: string,
    groupId?: string,
    productGroupId?: string,
    featureGroupId?: string,
    featureValuesId?: string,
}

/**
 * 
 * Search params
 * 
 */

type SearchParams = {
    searchText?: string,
    id?: string,
    productId?: string,
    projectId?: string,
    nodeId?: string,
    groupId?: string,
    emptyGroup?: boolean,
    featureGroupId?: string,
    featureValuesId?: string[],
    selectFeatureValues?: boolean,
    skip: number,
    take: number
}

@Injectable()
export default class ItemSearch {

    constructor(
        @InjectRepository(Item)
        private readonly repo: Repository<Item>,

        private readonly query: ItemQuery,

        private readonly authContext: AuthContext
    ) { }

    get nodeId() {
        const context = this.authContext.userContext;
        return context.nodeId;
    }

    /**
     * 
     * JOINS
     * 
     */

    private applyJoins(
        query: SelectQueryBuilder<Item>,
        params: SearchParams
    ) {

        const {
            groupId,
            featureGroupId,
            featureValuesId,
            projectId,
            emptyGroup,
            selectFeatureValues,
            nodeId
        } = params;

        query.innerJoin(
            "item.product",
            "product",
        ).innerJoin(
            "item.stock",
            "stock"
        ).leftJoin(
            "item.cost",
            "cost"
        ).leftJoin(
            "stock.items",
            "stockItem"
        ).innerJoin(
            "stockItem.node",
            "stockItemNode"
        )

        if (projectId) {
            query.innerJoin("product.project", "project")
        }

        if (groupId) {
            query.innerJoin(
                "item.groups",
                "group"
            );
        } else if (emptyGroup) {
            query.leftJoin(
                "item.groups",
                "groups"
            )
        }

        if (featureGroupId) {
            query
                .innerJoin(
                    "item.featureGroup",
                    "featureGroup"
                )
        } else if (selectFeatureValues) {
            query
                .leftJoin(
                    "item.featureGroup",
                    "featureGroup"
                )
        }

        if (featureValuesId) {
            query.innerJoin(
                "item.featureValues",
                "featureValue"
            )
        } else {
            query.leftJoin(
                "item.featureValues",
                "featureValue"
            )
        }

        if (nodeId) {
            query.innerJoin(
                "stock.items",
                "stockItem"
            );
        }

    }

    /**
     * 
     * FILTERS
     * 
     * @param query 
     * @param params 
     */

    private applyFilters(
        query: SelectQueryBuilder<Item>,
        params: SearchParams
    ) {
        const {
            id,
            productId,
            projectId,
            featureGroupId,
            featureValuesId,
            groupId,
            emptyGroup,
            searchText,
            skip,
            take,
            nodeId = this.nodeId
        } = params;

        query.where("1=1");

        if (projectId) {
            query.andWhere("project.id = :projectId", { projectId })
        }

        if (nodeId) {

            query.andWhere(
                "stockItem.nodeId = :nodeId",
                {
                    nodeId
                }
            )

        }

        if (id) {
            query.andWhere("item.id = :id", {
                id
            });
        }

        if (productId) {
            query.andWhere("product.id = :productId", {
                productId
            });
        }

        if (featureGroupId) {
            query.andWhere("featureGroup.id = :featureGroupId", {
                featureGroupId
            });
        }

        if (groupId) {
            query.andWhere("group.id = :groupId", {
                groupId
            });
        } else if (emptyGroup) {
            query.andWhere("group.id IS NULL");
        }

        if (searchText) {
            this.applySearchTextFilter(query, searchText);
        } else {
            query.orderBy(
                "item.createdAt",
                "DESC"
            )
        }

        if (featureValuesId?.length) {
            this.applyFeatureValuesFilter(query, featureValuesId);
        }

        query.distinct(true)
            .skip(skip)
            .take(take);

    }

    private applySearchTextFilter(
        query: SelectQueryBuilder<Item>,
        searchText: string
    ) {
        const normalizedSearch = searchText.trim();

        if (!normalizedSearch) return;

        query.andWhere(
            `(unaccent(item.name) ILIKE unaccent(:searchText)
        OR unaccent(item.sku) ILIKE unaccent(:searchText)
        OR unaccent(product.name) ILIKE unaccent(:searchText))`,
            {
                searchText: `%${normalizedSearch}%`
            }
        );

        query.addSelect(`
        CASE
            WHEN unaccent(item.sku) ILIKE unaccent(:exactSearch) THEN 1
            WHEN unaccent(item.name) ILIKE unaccent(:exactSearch) THEN 2
            WHEN unaccent(item.sku) ILIKE unaccent(:startsSearch) THEN 3
            WHEN unaccent(item.name) ILIKE unaccent(:startsSearch) THEN 4
            WHEN unaccent(product.name) ILIKE unaccent(:exactSearch) THEN 5
            WHEN unaccent(product.name) ILIKE unaccent(:startsSearch) THEN 6

            ELSE 7
        END
    `, "search_rank");

        query.orderBy("search_rank", "ASC");

        query.setParameters({
            exactSearch: normalizedSearch,
            startsSearch: `${normalizedSearch}%`
        });
    }

    private applyFeatureValuesFilter(
        query: SelectQueryBuilder<Item>,
        featureValuesId: string[]
    ) {
        const fvSubQuery = this.query.filterByFeatureValuesSubQuery(featureValuesId);
        query.andWhere(`item.id IN (${fvSubQuery.getQuery()})`)
        query.setParameters(fvSubQuery.getParameters());
    }

    /**
     * 
     * SELECTORS
     * 
     * @param query 
     */

    private applySelectors(query: SelectQueryBuilder<Item>) {
        query.loadAllRelationIds({
            relations: [
                "featureGroup",
                "groups",
                "featureValues.feature"
            ]
        })
            .select([
                ...makeSelectors(
                    "item",
                    [
                        "id",
                        "createdAt",
                        "name",
                        "sku",
                        "webVisibility"
                    ]
                ),
                ...makeSelectors(
                    "product",
                    [
                        "id",
                        "createdAt",
                        "name",
                        "subtractType",
                        "visibility",
                        "basePrice",
                        "unit",
                    ]
                ),
                ...makeSelectors(
                    "featureValue",
                    [
                        "id",
                        "value"
                    ]
                ),
                ...makeSelectors(
                    "cost",
                    [
                        "id"
                    ]
                ),
                ...makeSelectors(
                    "stock",
                    [
                        "id",
                        "quantity",
                        "remaining"
                    ]
                ),
                ...makeSelectors(
                    "stockItem",
                    [
                        "id",
                        "quantity",
                        "remaining"
                    ]
                ),
                ...makeSelectors(
                    "stockItemNode",
                    [
                        "id",
                        "name"
                    ]
                )
            ]);
    }

    /**
     * 
     * SEARCH
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    async search(
        params: SearchParams
    ): Promise<Item[]> {

        const query = this.repo.createQueryBuilder("item");

        this.applySelectors(query);
        this.applyJoins(query, params);
        this.applyFilters(query, params);

        const items = await query
            .getMany();

        return items;

    }

    /**
     * 
     * GET
     * 
     */

    /**
     * 
     * @param projectId 
     * @param dto 
     */

    async get(
        params: SearchParams
    ) {
        const items = await this.search(params);

        this.mapStockItems(items);

        return items;
    }

    mapStockItems(
        items: Item[]
    ) {

        for (const item of items) {

            const {
                stock
            } = item;

            if (!stock) continue;

            const {
                items
            } = stock;

            if (items.length === 1) {
                item.stock = {
                    ...(items[0] as object as Stock)
                };
            }

        }

    }

    /**
     * 
     * GET
     * 
     */

    async getById(
        itemId: string,
        projectId: string
    ) {
        return this.repo.findOne({
            where: {
                id: itemId,
                product: {
                    project: {
                        id: projectId
                    }
                }
            },
            relations: {
                product: true,
                featureValues: true,
                prices: true,
            },
            loadRelationIds: {
                relations: [
                    "groups",
                    "featureGroup"
                ]
            }
        })
    }

}