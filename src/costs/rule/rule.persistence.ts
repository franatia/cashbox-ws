import { BadRequestException, Injectable } from "@nestjs/common";
import RuleQuery, { UpdateAttributesParams, UpdateRelationsParams } from "./query/rule.query";
import { InternalRuleParams } from "./types/rule.types";
import { SaveRulePayload } from "./types/payload.types";
import { isEmptyObject } from "@/common/helpers/object.helper";

export type UpdateParams = UpdateAttributesParams & UpdateRelationsParams;

@Injectable()
export default class RulePersistence {
    constructor(
        private readonly query : RuleQuery
    ){}

    /**
     * 
     * @param rule 
     * @returns 
     */

    async prepareAndSave(
        rule: InternalRuleParams
    ): Promise<SaveRulePayload> {

        const {
            internalChildrenId,
            internalParentsId,
            ...saveParams
        } = rule

        const entity = await this.query.saveOne(saveParams);
        if (!entity) {
            throw new BadRequestException("Saved rule entity is undefined");
        }

        return {
            internalRule: rule,
            ruleEntity: entity
        };
    }

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    async prepareAndUpdate(
        id : string,
        params : UpdateParams
    ){

        const {
            parentId,
            childrenId,
            itemsId,
            ...attributes
        } = params;

        await this.query.updateRelations(
            id,
            {
                itemsId,
                childrenId,
                parentId
            }
        )

        if (isEmptyObject(attributes)) {
            return this.query.findOne({
                where: {
                    id
                }
            })
        }

        return this.query.updateAttributes(
            id,
            attributes
        )

    }

}