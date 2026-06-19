import { InjectRepository } from "@nestjs/typeorm";
import { FeatureGroup } from "../entities/feature-group.entity";
import { Repository } from "typeorm";
import { SelectQueryBuilder } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ItemGroup } from "../entities/item-group.entity";
import FeatureGroupQuery from "./feature-group.query";
import ItemGroupSearch from "../item-group/item-group.search";

type SearchParams = {
    id?: string,
    projectId?: string,
    featuresId?: string[],
    skip : number,
    take : number
}

@Injectable()
export class FeatureGroupSearch {
    constructor(
        @InjectRepository(FeatureGroup)
        private readonly repo: Repository<FeatureGroup>,

        private readonly query: FeatureGroupQuery,
        private readonly itemGroupSearch : ItemGroupSearch
    ) { }

    /**
     * 
     * QUERY
     * 
     */

    /**
     * 
     * EXCLUSIVO METODO SEARCH
     * 
     * @param query 
     * 
     */

    private applyJoins(
        query : SelectQueryBuilder<FeatureGroup>
    ){
        query
            .innerJoin("featureGroup.items", "item")
            .innerJoin("item.feature", "feature")
            .innerJoin("featureGroup.product", "product")
    }

    /**
     * 
     * EXCLUSIVO METODO SEARCH
     * 
     * @param query 
     * 
     */

    private async applyFilters(
        query: SelectQueryBuilder<FeatureGroup>,
        params: SearchParams
    ) {

        const {
            featuresId,
            id,
            projectId
        } = params

        query.where("1=1");

        if (id) {
            query.andWhere("featureGroup.id = :id", { id });
        }

        if (projectId) {
            query.andWhere("product.projectId = :projectId", {
                projectId
            })
        }

        if (featuresId?.length) {
            await this.applyFeaturesFilter(query, featuresId);
        }

        return query.distinct(true)
            .orderBy("featureGroup.createdAt", "DESC");

    }

    /**
     * 
     * EXCLUSIVO METODO SEARCH
     * 
     * @param query 
     * 
     */

    private async applyFeaturesFilter(
        query: SelectQueryBuilder<FeatureGroup>,
        featuresId: string[]
    ) {

        const subquery = await this.query.filterByFeaturesSubQuery(featuresId);

        query.andWhere(`featureGroup.id IN (${subquery.getQuery()})`)
            .setParameters(subquery.getParameters());

    }

    /**
     * 
     * EXCLUSIVO METODO SEARCH
     * 
     * @param query 
     * 
     */

    private applySelectors(
        query: SelectQueryBuilder<FeatureGroup>
    ) {
        query.loadAllRelationIds({
            relations: ["product", "itemGroups"]
        }).addSelect([
            "item.id",
            "feature.id",
            "feature.name"
        ])
    }

    /**
     * 
     * @param params 
     */

    private async search(
        params: SearchParams
    ) {

        const {
            skip,
            take
        } = params;
        const query = this.repo.createQueryBuilder("featureGroup");

        this.applySelectors(query);
        this.applyJoins(query);
        await this.applyFilters(query, params);

        return query
        .skip(skip)
        .take(take)
        .getMany();

    }

    /**
     * 
     * SUBQUERY
     * 
     */

    private filterItemGroupsSubQuery(
        featureGroupId: string
    ) {
        return this.repo.manager
            .createQueryBuilder()
            .subQuery()
            .from(ItemGroup, "filterIg")
            .where("filterIg.featureGroupId = :filterIgFeatureGroupId", {
                filterIgFeatureGroupId: featureGroupId
            })
            .select("filterIg.id")
    }

    /**
     * 
     * GET PORTS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    get(
        params: SearchParams
    ) {
        return this.search(params);
    }

    async getById(
        id: string
    ) {

        const itemGroups = await this.itemGroupSearch.get({
            skip : 0,
            take : 6,
            featureGroupId : id
        })

        const featureGroup = await this.repo.createQueryBuilder("featureGroup")

            .innerJoin(
                "featureGroup.items",
                "item"
            )
            .innerJoin(
                "item.feature",
                "feature"
            )
            .innerJoin(
                "feature.values",
                "fv"
            )

            .where({ id })
            .loadAllRelationIds({
                relations: [
                    "product",
                ]
            })
            .addSelect([
                "featureGroup.id",

                "item.id",
                "item.main",
                "item.level",
                "feature.id",
                "feature.name",
                "fv.id",
                "fv.value",
            ])

            .getOne();

        return {
            ...featureGroup,
            itemGroups
        }

    }

}