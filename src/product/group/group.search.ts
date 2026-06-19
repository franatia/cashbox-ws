import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Group } from "../entities/group.entity";
import { Repository } from "typeorm";
import { SelectQueryBuilder } from "typeorm/browser";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { notSearchParamsEmpty } from "@/common/helpers/params/search-params.helper";
import ProductSearch from "../core/product.search";

type SearchParams = {
    id ?: string,
    productId ?: string,
    parentGroupId ?: string,
    level ?: number,
    projectId ?: string
} & BasicSearchParams;

@Injectable()
export default class GroupSearch {
    constructor(
        @InjectRepository(Group)
        private readonly repo: Repository<Group>,

        @Inject(forwardRef(() => ProductSearch))
        private readonly productSearch : ProductSearch
    ) { }

    private applyJoins(
        query: SelectQueryBuilder<Group>,
        params: SearchParams
    ) {
        
        const {
            productId
        } = params;

        query
            .leftJoin(
                "group.parentGroup",
                "parent"
            )

        if(productId){
            query.innerJoin(
                "group.products",
                "product"
            )
        }

    }

    private applyFilters(
        query : SelectQueryBuilder<Group>,
        params : SearchParams
    ){

        const {
            skip,
            take,
            id,
            parentGroupId,
            productId,
            projectId,
            level
        } = params;

        query.where("1=1");

        if(id){
            query.andWhere("group.id = :id", {
                id
            });
        }

        if(parentGroupId){
            query.andWhere("parent.id = :parentGroupId", {
                parentGroupId
            });
        }

        if(projectId){
            query.andWhere("group.projectId = :projectId", {
                projectId
            })
        }

        if(productId){
            query.andWhere("product.id = :productId", {
                productId
            })
        }

        if(level){
            query.andWhere("group.level = :level", {
                level
            })
        }

        query.distinct(true)
            .orderBy("group.createdAt", "DESC")
            .skip(skip)
            .take(take)

    }

    private applySelectors(
        query : SelectQueryBuilder<Group>
    ){
        query
            .loadAllRelationIds({
                relations : ["project"]
            })
            .addSelect([
                "group.name",
                "group.visibility",
                "group.level",
                "group.slug",
                "group.path",

                "parent.id",
                "parent.name",
                "parent.level",
                "parent.slug",
                "parent.path",
            ])
    }

    private search(
        params : SearchParams
    ) {

        const qb = this.repo.createQueryBuilder("group");

        this.applySelectors(qb);
        this.applyJoins(qb, params);
        this.applyFilters(qb, params);

        return qb.getMany();

    }

    get(
        params : SearchParams
    ){

        notSearchParamsEmpty(params);

        return this.search(params);

    }

    //TODO:
    async getById(
        id : string
    ){

        const group = await this.repo.createQueryBuilder("group")
            .leftJoin("group.parentGroup", "parent")
            .where("group.id = :id", {
                id
            })
            .loadAllRelationIds({
                relations : ["product"]
            })
            .addSelect([
                "group.name",
                "group.level",
                "group.visibility",
                "group.slug",
                "group.path",

                "parent.id",
                "parent.createdAt",
                "parent.level",
                "parent.path",
                "parent.name"
            ]).getOne();

        if(!group){
            throw new BadRequestException("Group not exists");
        }

        const products = await this.productSearch.get({
            groupId : id,
            take : 6,
            skip : 0
        })

        const childGroups = await this.search({
            parentGroupId : id,
            take : 10,
            skip : 0
        })

        return this.repo.merge(
            new Group(),
            group,
            {
                products,
                groups : childGroups
            }
        )

    }

}