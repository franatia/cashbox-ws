import { Injectable } from "@nestjs/common";
import { Item } from "../entities/item.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import ItemQuery from "./item.query";

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
    groupId?: string,
    emptyGroup ?: boolean,
    featureGroupId?: string,
    featureValuesId?: string[],
    selectFeatureValues?: boolean,
    skip : number,
    take : number
}

@Injectable()
export default class ItemSearch {

    constructor(
        @InjectRepository(Item)
        private readonly repo: Repository<Item>,

        private readonly query : ItemQuery
    ) { }

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
            selectFeatureValues
        } = params;

        query.innerJoin(
            "item.product",
            "product",
        );

        if (projectId) {
            query.innerJoin("product.project", "project")
        }

        if (groupId) {
            query.innerJoin(
                "item.groups",
                "group"
            );
        }else if(emptyGroup){
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
        }else if(selectFeatureValues){
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
            take
        } = params;

        query.where("1=1");

        if (projectId) {
            query.andWhere("project.id = :projectId", { projectId })
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
        }else if(emptyGroup){
            query.andWhere("group.id IS NULL");
        }

        if (searchText) {
            this.applySearchTextFilter(query, searchText);
        }else{
            query.orderBy(
                "item.createdAt",
                "DESC"
            )
        }

        if (featureValuesId?.length) {
            this.applyFeatureValuesFilter(query, featureValuesId);
        }

        query.distinct(true)
            .orderBy("item.createdAt", "DESC")
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
        OR unaccent(item.sku) ILIKE unaccent(:searchText))`,
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
            ELSE 5
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
            .addSelect([
                "item.id",
                "item.name",
                "item.sku",
                "item.webVisibility",
                "product.id",
                "product.name",
                "product.subtractType",
                "product.webVisibility",
                "product.basePrice",
                "product.unit",
                "featureValue.id",
                "featureValue.value"
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

        this.applyJoins(query, params);
        this.applyFilters(query, params);
        this.applySelectors(query);

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
        return this.search(params);
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
                relations : [
                    "groups",
                    "featureGroup"
                ]
            }
        })
    }

}