import { InjectRepository } from "@nestjs/typeorm";
import { ItemGroup, ItemGroupType } from "../entities/item-group.entity";
import { Repository } from "typeorm";
import { SelectQueryBuilder } from "typeorm";
import { ItemGroupService } from "./item-group.service";
import ItemGroupQuery from "./item-group.query";
import ItemSearch from "../item/item.search";
import FeatureValuesSearch from "../feature-values/feature-values.search";
import { BadRequestException } from "@nestjs/common";

/**
 * 
 * Search Params
 * 
 */

type SearchParams = {
    id?: string,
    searchText?: string,
    type?: ItemGroupType,
    projectId?: string
    productId?: string,
    featureGroupId?: string,
    featureValuesId?: string[],
    take : number,
    skip : number
}

export default class ItemGroupSearch {

    constructor(

        @InjectRepository(ItemGroup)
        private readonly repo: Repository<ItemGroup>,
        private readonly query : ItemGroupQuery,

        private readonly itemSearch : ItemSearch,
        private readonly featureValuesSearch : FeatureValuesSearch

    ) { }

    /**
     * 
     * JOINS
     * 
     */

    private applyJoins(
        query: SelectQueryBuilder<ItemGroup>,
        params: SearchParams
    ) {
        const {
            projectId,
            productId,
            featureValuesId
        } = params;

        query.innerJoin(
            "itemGroup.product",
            "product"
        )

        if (projectId || productId) {
            query.innerJoin(
                "product.project",
                "project"
            )
        }

        if (featureValuesId) {
            query.innerJoin(
                "itemGroup.featureValues",
                "featureValue"
            )
        }else{
            query.leftJoin(
                "itemGroup.featureValues",
                "featureValue"
            )
        }

        query.leftJoin(
            "featureValue.feature", 
            "feature"
        )

    }

    /**
     * 
     * FILTERS
     * 
     */

    private applyFilters(
        query: SelectQueryBuilder<ItemGroup>,
        params: SearchParams
    ) {
        const {
            id,
            productId,
            projectId,
            featureGroupId,
            featureValuesId,
            searchText,
            type,
            skip,
            take
        } = params;

        query.where("1=1")

        if (projectId) {
            query.andWhere("project.id = :projectId", {
                projectId
            });
        }

        if (id) {
            query.andWhere("itemGroup.id = :id", {
                id
            })
        }

        if (productId) {
            query.andWhere("product.id = :productId", {
                productId
            })
        }

        if (featureGroupId) {
            query.andWhere("itemGroup.featureGroupId = :featureGroupId", {
                featureGroupId
            })
        }

        if (featureValuesId) {
            this.applyFeatureValuesFilter(
                query,
                featureValuesId
            );
        }

        if (searchText) {
            this.applySearchTextFilter(
                query,
                searchText
            )
        } else {
            query.orderBy("itemGroup.createdAt", "DESC")
        }

        if (type) {
            query.andWhere("itemGroup.type = :type", { type });
        }

        query.distinct(true)
            .skip(skip)
            .take(take)

    }

    /**
     * 
     * SELECTORS
     * 
     */

    private applySelectors(
        query: SelectQueryBuilder<ItemGroup>
    ) {
        query.loadAllRelationIds({
            relations: [
                "productFeatureGroup",
            ]
        })
            .select([
                "itemGroup.id",
                "itemGroup.createdAt",
                "itemGroup.name",
                "itemGroup.type",
                "itemGroup.webVisibility",
                "itemGroup.basePrice",

                "featureValue.value",
                "feature.name",
                
                "piFeatureValue.value",
                "piFeature.name",

                "product.id",
                "product.name",
                "product.subtractType",
                "product.webVisibility",
                "product.basePrice",
                "product.unit",
            ])
    }

    /**
     * 
     * @param query 
     * @param searchText 
     * @returns 
     */

    private applySearchTextFilter(
        query: SelectQueryBuilder<ItemGroup>,
        searchText: string
    ) {
        const normalizedSearch = searchText.trim();
        if (!normalizedSearch) return;

        query.andWhere("unaccent(itemGroup.name) ILIKE unaccent(:searchText)", {
            searchText: `%${normalizedSearch}%`
        })

        query.addSelect(`
            CASE
                WHEN unaccent(itemGroup.name) ILIKE unaccent(:exactSearch) THEN 1
                WHEN unaccent(itemGroup.name) ILIKE unaccent(:startsSearch) THEN 2
                ELSE 3
            END
            `, "search_rank");

        query.orderBy("search_rank", "ASC");

        query.setParameters({
            exactSearch: normalizedSearch,
            startsSearch: `${normalizedSearch}%`
        })
    }

    private applyFeatureValuesFilter(
        query: SelectQueryBuilder<ItemGroup>,
        featureValuesId: string[]
    ) {
        const subQuery = this.query.filterByFeatureValuesSubQuery(featureValuesId);
        query.andWhere(`itemGroup.id IN(${subQuery.getQuery()})`)
            .setParameters(subQuery.getParameters())
    }

    /**
     * 
     * SEARCH
     * 
     */

    private async search(
        params: SearchParams
    ) {
        const query = this.repo.createQueryBuilder("itemGroup");

        this.applySelectors(query);
        this.applyJoins(query, params);
        this.applyFilters(query, params);

        const items = await query.getMany();

        return items;

    }

    /**
     * 
     * GET
     * 
     */

    async get(
        params: SearchParams
    ) {
        return this.search(params);
    }

    async getById(
        itemGroupId: string
    ) {

        const itemGroup = await this.repo
            .createQueryBuilder("group")
            .where("group.id = :itemGroupId", { itemGroupId })
            .loadAllRelationIds({
                relations: [
                    "group.prouctFeatureGroup"
                ]
            }).getOne();

        if(!itemGroup){
            throw new BadRequestException("Item group was not found");
        }

        const items = await this.itemSearch.get({
            groupId : itemGroupId,
            selectFeatureValues : true,
            skip : 0,
            take : 6
        })

        const featureValues = await this.featureValuesSearch.get({
            itemGroupId,
            skip : 0,
            take : 12
        })

        return this.repo.merge(
            new ItemGroup(),
            itemGroup,
            {
                items,
                featureValues
            }
        ) 
    }

}