import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Complement } from "../entities/complement.entity";
import { Repository } from "typeorm";
import { SelectQueryBuilder } from "typeorm/browser";
import { ComplementItemSearch } from "./complement-item.search";
import { isEmptyAndThrow } from "@/common/helpers/search-params.helper";

type SearchParams = {
    productId?: string,
    id?: string,
    skip: number,
    take: number
}

@Injectable()
export class ComplementSearch {
    constructor(
        @InjectRepository(Complement)
        private readonly repo: Repository<Complement>,

        private readonly itemSearch : ComplementItemSearch
        
    ) { }

    private applyJoins(
        params: SearchParams,
        query: SelectQueryBuilder<Complement>
    ) {

        const {
            productId
        } = params;

        if (productId) {
            query.innerJoin(
                "complement.product",
                "product"
            )
        }
    }

    private applyFilters(
        params : SearchParams,
        query: SelectQueryBuilder<Complement>
    ) {

        const {
            skip,
            take,
            id,
            productId
        } = params;

        query.where("1=1");

        if(id){
            query.andWhere("complement.id = :id",{
                id
            })
        }

        if(productId){
            query.andWhere("product.id = :productId", {
                productId
            })
        }

        query.distinct(true)
            .orderBy("complement.createdAt", "DESC")
            .skip(skip)
            .take(take);

    }

    private applySelectors(
        query : SelectQueryBuilder<Complement>
    ){
        query.loadAllRelationIds({
            relations : ["product"]
        }).addSelect([
            "complement.defaultQuantity",
            "complement.isOptional",
            "complement.isQuantitySelectable",
            "complement.type",
            "complement.name",
        ])
    }

    private async search(
        params: SearchParams
    ) {

        const query = this.repo.createQueryBuilder("complement");

        this.applyJoins(
            params,
            query
        );
        this.applyFilters(
            params,
            query
        )
        this.applySelectors(
            query
        )

        return query.getMany()

    };

    get(
        params : SearchParams
    ){

        isEmptyAndThrow(params);

        return this.search(params);
    }

    async getById(
        id : string
    ){

        const complement = await this.repo
            .createQueryBuilder("complement")
            .where("complement.id = :id",{
                id
            })
            .loadAllRelationIds({
                relations : [
                    "product",
                    "priceList"
                ]
            }).addSelect([
                "complement.createdAt",
                "complement.name",
                "complement.defaultQuantity",
                "complement.isOptional",
                "complement.isQuantitySelectable",
                "complement.type"
            ]).getOne();

        if(!complement) return {};

        const items = await this.itemSearch.get({
            complementId : id,
            skip : 0,
            take : 4
        });

        return {
            ...complement,
            items
        }

    }

}