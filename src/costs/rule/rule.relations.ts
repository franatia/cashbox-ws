import { BadRequestException, Injectable } from "@nestjs/common";
import RuleQuery from "./query/rule.query";
import { InternalRuleParams } from "./types/rule.types";
import { getEntitiesIdFromLinker } from "./helpers/internal-rule.helper";
import { In } from "typeorm";
import {ItemRelations} from "../item/item.relations";

@Injectable()
export class RuleRelations {
    constructor(
        private readonly query: RuleQuery,
        private readonly itemRelations : ItemRelations
    ) { }

    /**
     * 
     * LINKERS
     * 
     */

    /**
     * 
     * @param id 
     * @param projectId 
     * @param throwable 
     * @returns 
     */

    async linkedToProject(
        id: string,
        projectId: string,
        throwable: boolean = true
    ) {
        const exists = await this.query.exists({
            id,
            cost: {
                project: {
                    id: projectId
                }
            }
        })

        if (!exists && throwable) {
            throw new BadRequestException(
                "Cost rule is not linked with project"
            )
        }

        return exists;

    }

    /**
     * 
     * @param id 
     * @param costId 
     * @param throwable 
     * @returns 
     */

    async linkedToCost(
        id: string,
        costId: string,
        throwable: boolean = true
    ) {
        const exists = await this.query.exists({
            id,
            cost: {
                id: costId
            }
        })

        if (!exists && throwable) {
            throw new BadRequestException(

                "Cost rule is not linked with cost entity"
            )
        }

        return exists;
    }

    /**
     * 
     * @param rulesId 
     * @param costId 
     * @param throwable 
     * @returns 
     */

    async manyLinkedToCost(
        rulesId: string[],
        costId: string,
        throwable: boolean = true
    ) {
        const count = await this.query.count({
            id: In(rulesId),
            cost: {
                id: costId
            }
        })

        const exists = count === rulesId.length;

        if (!exists && throwable) {
            throw new BadRequestException("Rules are not linked with cost");
        }

        return exists;

    }

    /**
     * 
     * @param id 
     * @param rulesId 
     * @param throwable 
     * @returns 
     */

    async relatedWithRules(
        id: string,
        rulesId: string[],
        throwable: boolean = true
    ) {

        const allRules = [id, ...rulesId];

        const related = await this.query.haveSameCost(allRules);

        if (!related && throwable) {
            throw new BadRequestException(
                "All rules are not related"
            )
        }

        return related;

    }

    /**
     * 
     * @param id 
     * @param itemsId 
     * @param throwable 
     * @returns 
     */

    async relatedWithItems(
        id: string,
        itemsId: string[],
        throwable: boolean = true
    ) {

        const { cost } = await this.query.findOneOrFail({
            where: {
                id
            },
            select: {
                cost: true
            }
        })

        const costId = cost.id;

        const exists = await this.itemRelations
            .manyLinkedToCost(
                itemsId,
                costId,
                false
            );

        if (!exists && throwable) {
            throw new BadRequestException(
                "Rule is not related with given cost items"
            )
        }

        return exists;

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param rule 
     * @param linkerId 
     * @returns 
     */

    async setChildren(
        rule: InternalRuleParams,
        linkerId: Map<string, string>
    ) {
        const {
            internalId,
            internalChildrenId
        } = rule;

        if (!linkerId.has(internalId)) {
            throw new BadRequestException("Child rule id does not exists");
        }
        if (!internalChildrenId?.length) return;

        const ruleId = linkerId.get(
            internalId
        )!;

        const entitiesId = getEntitiesIdFromLinker(
            internalChildrenId,
            linkerId
        );

        return this.query.setChildren(ruleId, entitiesId);

    }

}