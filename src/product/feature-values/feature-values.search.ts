import { InjectRepository } from "@nestjs/typeorm";
import { FeatureValue } from "../entities/feature-value.entity";
import { Repository } from "typeorm";
import { SelectQueryBuilder } from "typeorm/browser";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { notSearchParamsEmpty } from "@/common/helpers/params/search-params.helper";

type SearchParams = {
    id ?: string
    featureId ?: string,
    itemGroupId ?: string
} & BasicSearchParams

export default class FeatureValuesSearch {
    constructor(
        @InjectRepository(FeatureValue)
        private readonly repo : Repository<FeatureValue>
    ){}

    private applyJoins(
        query : SelectQueryBuilder<FeatureValue>,
        params : SearchParams
    ){

        const {
            itemGroupId
        } = params;

        query.innerJoin("fv.feature", "feature");
    
        if(itemGroupId){
            query.innerJoin("fv.productItemGroups", "piGroup");
        }
        
    }

    private applyFilters(
        query : SelectQueryBuilder<FeatureValue>,
        params : SearchParams
    ){

        const {
            skip,
            take,
            featureId,
            id,
            itemGroupId
        } = params

        query.where("1=1");

        if(id){
            query.andWhere("fv.id = :id", {
                id
            })
        }

        if(featureId){
            query.andWhere("fv.featureId = :featureId", {
                featureId
            })
        }

        if(itemGroupId){
            query.andWhere("piGroup.id = :itemGroupId", {
                itemGroupId
            })
        }

        query.distinct(true)
            .orderBy("fv.createdAt", "DESC")
            .skip(skip)
            .take(take);

    }

    private applySelectors(
        query : SelectQueryBuilder<FeatureValue>
    ){
        query
            .addSelect([
                "fv.value",
                "feature.id",
                "feature.name"
            ])
    }

    private search(
        params : SearchParams
    ){
        const query = this.repo.createQueryBuilder("fv");

        this.applySelectors(query);
        this.applyJoins(query, params);
        this.applyFilters(query, params);

        return query.getMany();

    }
    
    get(
        params : SearchParams
    ){
        notSearchParamsEmpty(params);

        return this.search(params);

    }

}