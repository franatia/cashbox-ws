import { InjectRepository } from "@nestjs/typeorm";
import { ComplementItem } from "../entities/complement-item.entity";
import { Repository } from "typeorm";
import { SelectQueryBuilder } from "typeorm/browser";
import { Injectable } from "@nestjs/common";
import { isEmptyAndThrow } from "@/common/helpers/search-params.helper";

type SearchParams = {
    id?: string,
    complementId?: string,
    productItemId?: string,
    skip : number,
    take : number
}

@Injectable()
export class ComplementItemSearch {
    constructor(
        @InjectRepository(ComplementItem)
        private readonly repo: Repository<ComplementItem>
    ) { }

    private applyJoins(
        query: SelectQueryBuilder<ComplementItem>
    ) {
        query
            .innerJoin(
                "item.item",
                "pItem"
            )
            .innerJoin(
                "pItem.featureValues",
                "piFv"
            )
            .innerJoin(
                "piFv.feature",
                "piFeature"
            )
            .innerJoin(
                "pItem.product",
                "piProduct"
            )
    }

    private applyFilters(
        params : SearchParams,
        query : SelectQueryBuilder<ComplementItem>
    ){
        const {
            complementId,
            id,
            productItemId,
            skip,
            take
        } = params;

        query.where("1=1");

        if(id){
            query.andWhere("item.id = :id", {
                id
            })
        }

        if(complementId){
            query.andWhere("item.complementId = :complementId", {
                complementId
            })
        }

        if(productItemId){
            query.andWhere("pItem.id = :productItemId", {
                productItemId
            })
        }

        query.distinct(true)
            .orderBy("item.createdAt", "DESC")
            .skip(skip)
            .take(take);

    }

    private applySelectors(
        query : SelectQueryBuilder<ComplementItem>
    ){

        query.loadAllRelationIds({
            relations : ["complement"]
        }).addSelect([
            "pItem.id",
            "pItem.name",
            "pItem.sku",
            "pItem.webVisibility",

            "piFv.id",
            "piFv.value",
            "piFeature.id",
            "piFeature.name",
            "piProduct.id",
            "piProduct.name",
            "piProduct.slug",
            "piProduct.description"
        ])

    }

    private async search(
        params: SearchParams
    ) {

        const query = this.repo.createQueryBuilder(
            "item"
        )

        this.applyJoins(query);
        this.applyFilters(params, query);
        this.applySelectors(query);

        return query.getMany();

    }

    get(
        params : SearchParams
    ){
    
        isEmptyAndThrow(
            params
        );

        return this.search(params);
    }

}