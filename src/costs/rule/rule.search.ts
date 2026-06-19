import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import Rule from "../entities/rule.entity";
import { RuleOperator, RuleTag } from "../enums/rule.enum";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { Item } from "../entities/item.entity";
import { notObjectEmpty } from "@/common/helpers/object.helper";
import { Injectable } from "@nestjs/common";

type SearchParams = {
    id?: string,
    projectId?: string;
    costId?: string;
    itemsId?: string[];
    tag?: RuleTag;
    first?: boolean;
    operator?: RuleOperator;
    parentId?: string;
    childId?: string;

    itemsSkip?: number;
    itemsTake?: number;
} & BasicSearchParams;

@Injectable()
export class RuleSearch extends BaseSearch {

    constructor(
        @InjectRepository(Rule)
        private readonly repo: Repository<Rule>,

        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>
    ) {
        super()
    }

    protected applyJoins(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<any>
    ): void {
        const {
            parentId,
            childId,
            itemsId
        } = params;

        query.innerJoin(
            `${alias}.cost`,
            "cost"
        );

        if (childId) {
            query.innerJoin(
                `${alias}.children`,
                "ruleChild"
            )
        }

        if (itemsId) {
            query.innerJoin(
                `${alias}.items`,
                "costItem"
            )
        } else {
            query.leftJoin(
                `${alias}.items`,
                "costItem"
            )
        }

        query.leftJoin(
            "costItem.tax",
            "tax"
        )
            .leftJoin(
                "costItem.constant",
                "constant"
            )

    }

    protected applyFilters(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<any>
    ): void {

        const {
            id,
            costId,
            skip,
            take,
            childId,
            first,
            itemsId,
            operator,
            parentId,
            tag,
            itemsSkip,
            itemsTake,
            projectId
        } = params;

        query.where('1=1');

        if (id) {
            query.andWhere(
                `${alias}.id = :id`,
                {
                    id
                }
            )
        }

        if (projectId) {
            query.andWhere(
                "cost.projectId = :projectId",
                {
                    projectId
                }
            )
        }

        if (costId) {
            query.andWhere(
                `${alias}.costId = :costId`,
                {
                    costId
                }
            )
        }

        if (childId) {
            query.andWhere(
                "ruleChild.id = :childId",
                {
                    childId
                }
            )
        }

        if (parentId) {
            query.andWhere(
                `${alias}.parentId = :parentId`,
                {
                    parentId
                }
            )
        }

        if (itemsId) {
            this.applyCostItemFilter(
                itemsId,
                {
                    skip: itemsSkip ?? 0,
                    take: itemsTake ?? 4
                },
                query
            )
        }

        if (operator) {
            query.andWhere(
                `${alias}.operator = :operator`,
                {
                    operator
                }
            )
        }

        if (tag) {
            query.andWhere(
                `:tag = ANY(${alias}.tags)`,
                { tag }
            )
        }

        if (first) {
            query.andWhere(
                `${alias}.first = :first`,
                {
                    first
                }
            )
        }

        query
            .distinct(true)
            .orderBy(`${alias}.createdAt`, "DESC")
            .skip(skip)
            .take(take)

    }

    private applyCostItemFilter(
        itemsId: string[],
        params: BasicSearchParams,
        query: SelectQueryBuilder<Item>
    ) {

        const {
            skip,
            take
        } = params;

        const subquery = this.itemRepo.createQueryBuilder("filtCostItem")
            .where("filtCostItem.id IN (:...itemsId)",
                {
                    itemsId
                }
            )
            .select("filtCostItem.id")
            .orderBy("filtCostItem.createdAt", "DESC")
            .skip(skip)
            .take(take);

        query.andWhere(
            `costItem.id IN (${subquery.getQuery()})`
        )
            .setParameters(subquery.getParameters());

    }

    protected applySelectors(
        alias: string,
        params: BasicSearchParams,
        query: SelectQueryBuilder<any>
    ): void {
        query.loadAllRelationIds({
            relations: ["parents", "children"]
        }).select([
            ...makeSelectors(
                alias,
                [
                    "id",
                    "createdAt",
                    "operator",
                    "tags",
                    "first"
                ]
            ),
            ...makeSelectors(
                "costItem",
                [
                    "id",
                    "createdAt",
                    "name",
                    "type",
                    "valueSource",
                    "defaultValue",
                    "tags"
                ]
            ),
            ...makeSelectors(
                "constant",
                [
                    "id",
                    "name",
                    "value"
                ]
            ),
            ...makeSelectors(
                "tax",
                [
                    "id",
                    "alias",
                    "denomination",
                    "percentage",
                    "amount",
                    "valueType",
                    "jurisdiction"
                ]
            )
        ])
    }

    protected search(
        alias: string,
        params: SearchParams
    ) {

        const query = this.repo.createQueryBuilder(
            alias
        )

        this.applySelectors(
            alias,
            params,
            query
        )

        this.applyJoins(
            alias,
            params,
            query
        )

        this.applyFilters(
            alias,
            params,
            query
        )

        return query.getMany();

    }

    get(params: SearchParams) {

        notObjectEmpty(params);

        return this.search(
            "rule",
            params
        )
    }

    async getById(id: string): Promise<any> {

        const raw = await this.search(
            "rule",
            {
                id,
                skip: 0,
                take: 1
            }
        );

        if (raw.length) return raw[0];

        return {};

    }

}   