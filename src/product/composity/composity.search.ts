import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Composity from "../entities/composity.entity";
import { Repository } from "typeorm";
import { BasicSearchParams } from "@/common/interfaces/search-params.interface";
import { isEmptyAndThrow } from "@/common/helpers/search-params.helper";
import { SelectQueryBuilder } from "typeorm/browser";

type SearchParams = {
    id?: string;
    productId?: string;
    itemId?: string;
} & BasicSearchParams

@Injectable()
export default class CompositySearch {
    constructor(
        @InjectRepository(Composity)
        private readonly repo: Repository<Composity>
    ) { }

    private applyJoins(
        query: SelectQueryBuilder<Composity>
    ) {

        query
            .innerJoin("composity.item", "item")
            .leftJoin("item.featureValues", "fv")
            .innerJoin("fv.feature", "feature")
            .innerJoin("item.product", "product")

    }

    private applyFilters(
        query: SelectQueryBuilder<Composity>,
        params: SearchParams
    ) {
        const {
            skip,
            take,
            id,
            itemId,
            productId
        } = params;

        query.where("1=1");

        if (id) {
            query.andWhere("composity.id = :id", {
                id
            })
        }

        if (itemId) {
            query.andWhere("composity.itemId = :itemId", {
                itemId
            })
        }

        if (productId) {
            query.andWhere("composity.productId = :productId", {
                productId
            })
        }

        query.distinct(true)
            .orderBy("composity.createdAt", "DESC")
            .skip(skip)
            .take(take);

    }

    private applySelectors(
        query: SelectQueryBuilder<Composity>
    ) {
        query.loadAllRelationIds({
            relations: [
                "product"
            ]
        }).addSelect([
            "composity.quantity",
            "item.name",
            "item.sku",

            "fv.id",
            "fv.value",
            "feature.id",
            "feature.name",

            "product.id",
            "product.name",
            "product.slug",
            "product.description"
        ])
    }

    private search(
        params: SearchParams
    ) {

        const query = this.repo.createQueryBuilder("composity");

        this.applyJoins(query)
        this.applyFilters(query, params);
        this.applySelectors(query);

        return query.getMany();

    }

    get(
        params: SearchParams
    ) {

        isEmptyAndThrow(params);

        return this.search(params);
    }

}