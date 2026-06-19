import { InjectRepository } from "@nestjs/typeorm";
import { Feature } from "../entities/feature.entity";
import { Repository } from "typeorm";
import { SelectQueryBuilder } from "typeorm/browser";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { notSearchParamsEmpty } from "@/common/helpers/params/search-params.helper";
import { BadRequestException } from "@nestjs/common";
import FeatureValuesSearch from "../feature-values/feature-values.search";

type SearchParams = {
    id ?: string,
    productId ?: string
} & BasicSearchParams

export default class FeatureSearch {
    constructor(
        @InjectRepository(Feature)
        private readonly repo : Repository<Feature>,

        private readonly valuesSearch : FeatureValuesSearch
    ){}

    applyFilters(
        query : SelectQueryBuilder<Feature>,
        params : SearchParams
    ){

        const {
            id,
            productId,
            skip,
            take
        } = params;

        query.where("1=1");

        if(id){
            query.andWhere("feature.id = :id", {
                id
            })
        }

        if(productId){
            query.andWhere("feature.productId = :productId", {
                productId
            })
        }

        query.distinct(true)
            .orderBy("feature.createdAt", "DESC")
            .skip(skip)
            .take(take)

    }

    private applySelectors(
        query : SelectQueryBuilder<Feature>
    ){
        query.loadAllRelationIds({
            relations : ["product"]
        })
        .addSelect([
            "feature.name"
        ])
    }

    private search(
        params : SearchParams
    ){
        const query = this.repo.createQueryBuilder("feature");

        this.applySelectors(query);
        this.applyFilters(query, params);

        return query.getMany();
    }

    get(
        params : SearchParams
    ){

        notSearchParamsEmpty(params);

        return this.search(params);

    }

    async getById(
        id : string
    ){

        const feature = await this.repo.createQueryBuilder("feature")
            .where("feature.id = :id", {
                id
            })
            .loadAllRelationIds({
                relations : ["product"]
            })
            .addSelect([
                "feature.name"
            ]).getOne();

        if(!feature){
            throw new BadRequestException("Feature was not found");
        }

        const values = await this.valuesSearch.get({
            featureId : id,
            take : 0,
            skip : 12
        })

        return this.repo.merge(
            new Feature(),
            feature,
            {
                values
            }
        )

    }

}