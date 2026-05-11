import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product, ProductOriginType, ProductSubtractType, ProductUnit } from "../entities/product.entity";
import { Repository } from "typeorm";
import { SelectQueryBuilder } from "typeorm/browser";
import { BasicSearchParams } from "@/common/interfaces/search-params.interface";
import { isEmptyAndThrow } from "@/common/helpers/search-params.helper";
import GroupSearch from "../group/group.search";
import ItemSearch from "../item/item.search";
import ItemGroupSearch from "../item-group/item-group.search";
import { ComplementSearch } from "../complement/complement.search";
import CompositySearch from "../composity/composity.search";
import FeatureSearch from "../features/features.search";
import GroupQuery from "../group/group.query";

type SearchParams = {

    id?: string,
    subtractType?: ProductSubtractType,
    originType?: ProductOriginType,
    unit?: ProductUnit,
    allowReservation?: boolean,
    visibility?: boolean,
    active?: boolean,
    projectId?: string,
    groupId?: string,
    groupPath?: string,
    brandId?: string,
    catalogId?: string,
    linkingCatalogId?: string,
    linkingProductId?: string,

    searchText?: string,

} & BasicSearchParams

@Injectable()
export default class ProductSearch {

    constructor(
        @InjectRepository(Product)
        private readonly repo: Repository<Product>,

        @Inject(forwardRef(() => GroupSearch))
        private readonly groupSearch : GroupSearch,
        
        private readonly itemSearch : ItemSearch,
        private readonly itemGroupSearch : ItemGroupSearch,
        private readonly complementSearch : ComplementSearch,
        private readonly compositySearch : CompositySearch,
        private readonly featureSearch : FeatureSearch,
        private readonly groupQuery : GroupQuery

    ) { }

    private applyJoins(
        query: SelectQueryBuilder<Product>,
        params: SearchParams
    ) {

        const {
            catalogId
        } = params;

        query
            .leftJoin("product.groups", "group")
            .leftJoin("product.items", "item")
            .leftJoin("product.itemGroups", "itemGroup")
            .leftJoin("product.brand", "brand")
            .leftJoin("product.linkingCatalog", "linkingCatalog")
            .leftJoin("linkingCatalog.source", "sourceCatalog");

        if (catalogId) {
            query.innerJoin("product.catalogs", "catalog");
        }

    }

    private applyFilters(
        query: SelectQueryBuilder<Product>,
        params: SearchParams
    ) {

        const {
            id,
            skip,
            take,
            active,
            allowReservation,
            brandId,
            catalogId,
            groupId,
            linkingCatalogId,
            linkingProductId,
            originType,
            projectId,
            subtractType,
            unit,
            visibility,
            searchText,
            groupPath
        } = params;

        query.where("1=1");

        if (id) {
            query.andWhere("product.id = :id", {
                id
            })
        }

        if (active !== undefined && active !== null) {
            query.andWhere("product.active = :active", {
                active
            })
        }

        if (allowReservation !== undefined && allowReservation !== null) {
            query.andWhere("product.allowReservation = :allowReservation", {
                allowReservation
            })
        }

        if (originType) {
            query.andWhere("product.originType = :originType", {
                originType
            })
        }

        if (subtractType) {
            query.andWhere("product.subtractType = :subtractType", {
                subtractType
            })
        }

        if (unit) {
            query.andWhere("product.unit = :unit", {
                unit
            })
        }

        if (visibility !== undefined && visibility !== null) {
            query.andWhere("product.visibility = :visibility", {
                visibility
            })
        }

        if (brandId) {
            query.andWhere("product.brandId = :brandId", {
                brandId
            })
        }

        if (catalogId) {
            query.andWhere("catalog.id = :catalogId", {
                catalogId
            })
        }

        if (groupId) {
            query.andWhere("group.id = :groupId", {
                groupId
            })
        }

        if(groupPath){
            this.applyGroupPathFilter(
                query,
                groupPath
            )
        }

        if (linkingProductId) {
            query.andWhere("product.linkingProductId = :linkingProductId", {
                linkingProductId
            })
        }

        if(linkingCatalogId){
            query.andWhere("linkingCatalog.id = :linkingCatalogId", {
                linkingCatalogId
            })
        }

        if (projectId) {
            query.andWhere("product.projectId = :projectId", {
                projectId
            })
        }

        if(searchText){
            this.applySearchTextFilter(
                query,
                searchText
            )
        }

        query.distinct(true)
            .orderBy("product.createdAt", "DESC")
            .skip(skip)
            .take(take);

    }

    private applySearchTextFilter(
        query: SelectQueryBuilder<Product>,
        searchText: string
    ) {
        const normalizedSearch = searchText.trim();

        if (!normalizedSearch) return;

        query.andWhere(
            `(unaccent(product.name) ILIKE unaccent(:searchText)
            OR unaccent(product.slug) ILIKE unaccent(:searchText))
            OR unaccent(product.description) ILIKE unaccent(:searchText)`,
            {
                searchText: `%${normalizedSearch}%`
            }
        );

        query.addSelect(`
            CASE
                WHEN unaccent(product.name) ILIKE unaccent(:exactSearch) THEN 1
                WHEN unaccent(product.slug) ILIKE unaccent(:exactSearch) THEN 2
                WHEN unaccent(product.description) ILIKE unaccent(:exactSearch) THEN 3
                WHEN unaccent(product.name) ILIKE unaccent(:startsSearch) THEN 4
                WHEN unaccent(product.slug) ILIKE unaccent(:startsSearch) THEN 5
                WHEN unaccent(product.description) ILIKE unaccent(:startsSearch) THEN 6
                ELSE 7
            END
        `, "search_rank");

        query.orderBy("search_rank", "ASC");

        query.setParameters({
            exactSearch: normalizedSearch,
            startsSearch: `${normalizedSearch}%`
        });
    }

    private applyGroupPathFilter(
        query : SelectQueryBuilder<Product>,
        path : string
    ){
        const sq = this.groupQuery.filterByPathSq(
            path
        );

        query.andWhere(`group.id IN (${sq.getQuery()})`)
        query.setParameters(sq.getParameters())
    }

    private applySelectors(
        query: SelectQueryBuilder<Product>
    ) {
        query.loadAllRelationIds({
            relations: ["project", "linkingProduct"]
        }).addSelect([
            "product.name",
            "product.description",
            "product.slug",
            "product.subtractType",
            "product.originType",
            "product.allowReservation",
            "product.visibility",
            "product.active",
            "product.basePrice",
            "product.unit",

            "linkingCatalog.id",
            "sourceCatalog.id",
            "sourceCatalog.name",

            "brand.id",
            "brand.name"
        ]);
    }

    private search(
        params : SearchParams
    ) {
        const query = this.repo.createQueryBuilder("product");

        this.applyJoins(query, params);
        this.applyFilters(query, params);
        this.applySelectors(query);

        return query.getMany();

    }

    get(
        params : SearchParams
    ){
        
        isEmptyAndThrow(params);

        return this.search(params);

    }

    async getById(
        id : string
    ){

        const product = await this.repo.findOne({
            where : {
                id
            },
            loadRelationIds : {
                relations : ["project"]
            },
            select : {
                id : true,
                createdAt : true,
                name : true,
                description : true,
                slug : true,
                subtractType : true,
                originType : true,
                allowReservation : true,
                visibility : true,
                active : true,
                basePrice : true,
                unit : true
            }
        });

        if(!product){
            throw new BadRequestException("Product not exists");
        }

        const skip = 0;

        const groups = await this.groupSearch.get({
            productId : id,
            take : 4,
            skip
        })

        const items = await this.itemSearch.get({
            productId : id,
            emptyGroup : true,
            take : 6,
            skip : 0
        })

        const itemGroups = await this.itemGroupSearch.get({
            productId : id,
            take : 6,
            skip
        })

        const features = await this.featureSearch.get({
            productId : id,
            take : 6,
            skip
        })

        const complements = await this.complementSearch.get({
            productId : id,
            take : 6,
            skip
        })

        const composities = await this.compositySearch.get({
            productId : id,
            take : 6,
            skip
        });

        return this.repo.merge(
            new Product(),
            product,
            {
                groups,
                itemGroups,
                items,
                complements,
                composities,
                features
            }
        )

    }

}

