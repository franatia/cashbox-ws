import {BaseService} from "@/common/models/crud/base-service.crud";
import RuleFactory from "./rule.factory";
import { InternalRuleParams, ReceivedRuleParams } from "./types/rule.types";
import RulePersistence, { UpdateParams } from "./rule.persistence";
import { RuleRelations } from "./rule.relations";
import RuleQuery from "./query/rule.query";
import { BadRequestException, Injectable } from "@nestjs/common";
import { rulesTemplate, RulesTemplateKeys } from "./templates/rule.template";
import { SaveRulePayload } from "./types/payload.types";

type CreateParams = {
    costId: string;
    first: string;
    rules: Record<string, ReceivedRuleParams>;
}

@Injectable()
export class RuleService implements BaseService {

    constructor(
        private readonly factory: RuleFactory,
        private readonly persistence: RulePersistence,
        private readonly relations: RuleRelations,
        private readonly query: RuleQuery
    ) {

    }

    /**
     * 
     * HELPERS
     * 
     */

    validateRulesConsistence(
        rules: ReceivedRuleParams[]
    ) {

        for (const rule of rules) {
            const {
                parentsId,
                childrenId
            } = rule;

            if (!parentsId?.length || !childrenId?.length) continue;

            for (const parentId of parentsId) {
                if (childrenId.includes(parentId)) {
                    throw new BadRequestException(
                        "No rule can be child and parent at the same time"
                    );
                }
            }
        }

    }

    /**
     * 
     * CREATORS
     * 
     */

    /**
     * 
     * @param params
     */

    async create(
        params: CreateParams
    ) {
        const {
            rules,
            costId,
            first
        } = params;

        this.validateRulesConsistence(
            Object.values(rules)
        );

        const internalRules = this.factory.buildInternalRules(
            rules,
            {
                costId,
                first
            }
        );

        return this.createByInternalRules(internalRules);

    }

    /**
     * 
     * @param costId 
     * @returns 
     */

    createTemplate(
        costId: string
    ) {
        return this.create({
            costId,
            first: RulesTemplateKeys.FIRST,
            rules: rulesTemplate
        })
    }

    /**
     * 
     * @param rules 
     * @param first 
     */

    private async createByInternalRules(
        rules : InternalRuleParams[]
    ) {

        const payloads = await this.resolveSaveRules(rules);

        const linkerId = this.factory.mapEntityIdByInternalId(
            ...payloads
        )

        // TODO : DE MOMENTO NO HAY PROBLEMA, PERO SI ESCALA SI

        await Promise.all(
            rules.map(param => (
                this.relations.setChildren(
                    param,
                    linkerId
                )
            ))
        );

        return this.factory.prepareCreateResponse(
            payloads
        );

    }

    /**
     * 
     * PUT
     * 
     */

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    async put(
        id: string,
        params: UpdateParams
    ) {

        return this.persistence.prepareAndUpdate(
            id,
            params
        )

    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param id 
     * @returns 
     */

    async delete(
        id: string
    ) {

        return this.query.deleteOne(id);

    }

    /**
     * 
     * RESOLVERS
     * 
     */

    /**
     * 
     * @param ruleParams 
     * @returns 
     */

    async resolveSaveRules(
        ruleParams: InternalRuleParams[]
    ) {

        const payloads: SaveRulePayload[] = []


        for (const param of ruleParams) {

            const payload = await this.persistence.prepareAndSave(
                param
            )

            payloads.push(payload);

        }

        return payloads;

    }

}