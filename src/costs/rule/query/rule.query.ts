import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import Rule from "../../entities/rule.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { RuleOperator, RuleTag } from "../../enums/rule.enum";
import { CalculateContext } from "../types/context.types";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { Injectable } from "@nestjs/common";

type OrmParams = {
    id?: string;
    operator?: RuleOperator;
    tags?: RuleTag[];
    first?: boolean;
    costId?: string;
    itemsId?: string[];
    parentId?: string;
    childrenId?: string[];
}

export type SaveParams = {
    operator: RuleOperator;
    tags: RuleTag[];
    first?: boolean;
    costId: string;
    itemsId?: string[];
    parentId?: string;
    childrenId?: string[];
}

export type UpdateRelationsParams = {
    parentId?: string;
    itemsId?: string[];
    childrenId?: string[];
}

export type UpdateAttributesParams = {
    operator?: RuleOperator;
    tags?: RuleTag[];
}

@Injectable()
export default class RuleQuery extends BaseQuery<Rule> {
    constructor(
        @InjectRepository(Rule)
        repo: Repository<Rule>
    ) {
        super(Rule, repo);
    }

    /**
     * 
     * FINDERS
     * 
     */

    findByCalculateContext(
        context: CalculateContext
    ) {

        const {
            productItemId,
            costId
        } = context;
        const query = this.repo.createQueryBuilder("rule");

        return query.leftJoin("rule.productItems", "pi")
            .where("pi.id = :productItemId", {
                productItemId
            })
            .andWhere("costId = :costId", {
                costId
            })
            .loadAllRelationIds({
                relations: ["parents", "children", "items"]
            })
            .select([
                ...makeSelectors(
                    "rule",
                    [
                        "id",
                        "operator",
                        "tags",
                        "first",
                        "parents",
                        "children",
                        "items"
                    ]
                )
            ]).getMany();

    }

    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    async saveOne(
        params: SaveParams
    ) {
        const orm = this.makeOrm(params);

        const raw = await this.save(orm);
        if (raw.length) {
            return raw[0];
        }
    }

    /**
     * 
     * UPDATERS
     * 
     */

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    async updateAttributes(
        id: string,
        params: UpdateAttributesParams
    ) {

        return this.resolveUpdate(
            {id},
            params
        )

    }

    /**
     * 
     * DELETE
     * 
     */

    async deleteOne(
        id: string
    ) {
        await this.delete({id});
        return {
            deletedRule: id
        };
    }

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    updateRelations(
        id: string,
        params: UpdateRelationsParams
    ) {

        const {
            childrenId,
            itemsId,
            parentId
        } = params;

        const promises: Promise<any>[] = [];

        if (parentId?.length) {
            promises.push(
                this.resolveUpdate(
                    {id},
                    {
                        parent : {
                            id : parentId
                        }
                    }
                )
            )
        }

        if (childrenId?.length) {
            promises.push(
                this.setChildren(
                    id,
                    childrenId
                )
            )
        }

        if (itemsId?.length) {
            promises.push(
                this.setItems(
                    id,
                    itemsId
                )
            )
        }

        if (!promises.length) return;

        return Promise.all(promises);

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    makeOrm(params: OrmParams): DeepPartial<Rule> {
        const {
            costId,
            itemsId,
            parentId,
            childrenId,
            ...rest
        } = params;

        const orm: DeepPartial<Rule> = {
            ...rest
        };

        if (costId) {
            orm.cost = {
                id: costId
            };
        }

        if (itemsId) {
            orm.items = itemsId.map(id => ({ id }));
        }

        if (parentId) {
            orm.parent = {
                id : parentId
            };
        }

        if (childrenId) {
            orm.children = childrenId.map(id => ({ id }));
        }

        return orm;

    }

    async haveSameCost(
        rulesId: string[]
    ) {

        const query = this.repo.createQueryBuilder("rule");

        const result = await query
            .innerJoin("rule.cost", "cost")
            .where("rule.id IN (:...rulesId)", { rulesId })
            .select("COUNT(DISTINCT rule.id)", "rulesCount")
            .addSelect("COUNT(DISTINCT cost.id)", "costsCount")
            .getRawOne();

        const valid =
            Number(result.rulesCount) === rulesId.length &&
            Number(result.costsCount) === 1;

        return valid;

    }

    /**
     * 
     * RELATIONS
     * 
     */

    /**
     * 
     * @param id 
     * @param itemsId 
     * @returns 
     */

    async setItems(
        id: string,
        itemsId: string[]
    ) {
        const {items} = await this.findOneOrFail({
            where : {id},
            loadRelationIds : {
                relations : ["items"]
            },
            select : [
                "items"
            ]
        })
        const currentItemsId = items.map(item => String(item));

        const addItems = itemsId.filter(itemId => !currentItemsId.includes(itemId));
        const removeItems = currentItemsId.filter(itemId => !itemsId.includes(itemId));

        await this.addItems(
            id,
            addItems
        )

        await this.removeItems(
            id,
            removeItems
        )
    }

    /**
     * 
     * @param id 
     * @param itemsId 
     * @returns 
     */

    addItems(
        id: string,
        itemsId: string[]
    ) {
        if(!itemsId.length) return;

        return this.repo.createQueryBuilder()
            .relation(Rule, "items")
            .of(id)
            .add(itemsId);
    }

    /**
     * 
     * @param id 
     * @param itemsId 
     * @returns 
     */

    removeItems(
        id: string,
        itemsId: string[]
    ) {
        if(!itemsId.length) return;

        return this.repo.createQueryBuilder()
            .relation(Rule, "items")
            .of(id)
            .remove(itemsId);
    }

    /**
     * 
     * @param id 
     * @param childrenId 
     * @returns 
     */

    async setChildren(
        id: string,
        childrenId: string[]
    ) {
        const {children} = await this.findOneOrFail({
            where : {id},
            loadRelationIds : {
                relations : ["children"]
            },
            select : [
                "children"
            ]
        })
        const currentChildrenId = children.map(parent => String(parent));

        const addChildren = childrenId.filter(childId => !currentChildrenId.includes(childId));
        const removeChildren = currentChildrenId.filter(childId => !childrenId.includes(childId));

        await this.addChildren(
            id,
            addChildren
        )

        await this.removeChildren(
            id,
            removeChildren
        )
    }

    /**
     * 
     * @param id 
     * @param childrenId 
     * @returns 
     */

    addChildren(
        id: string,
        childrenId: string[]
    ) {
        return this.repo.createQueryBuilder()
            .relation(Rule, "children")
            .of(id)
            .add(childrenId)
    }

    /**
     * 
     * @param id 
     * @param childrenId 
     * @returns 
     */

    removeChildren(
        id: string,
        childrenId: string[]
    ) {
        return this.repo.createQueryBuilder()
            .relation(Rule, "children")
            .of(id)
            .remove(childrenId);
    }

}