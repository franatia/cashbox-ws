import { BadRequestException, Injectable } from "@nestjs/common";
import { InternalRuleParams, ReceivedRuleParams, RuleSeed } from "./types/rule.types";
import Rule from "../entities/rule.entity";
import { CreateResponse } from "./types/response.types";
import { SaveRulePayload } from "./types/payload.types";
import { hasObjectValues } from "@/common/helpers/object.helper";
import { ProductItemParams, StrictProductItemParams } from "./types/params/product-item.param";
import { ItemContext } from "./types/context.types";
import { ItemSeed } from "./types/items.types";
import { TaxValueType } from "@/tax/enums/value.enum";
import RuleResult from "./models/rule-result.model";
import { ItemType } from "../enums/item.enum";
import { isObject, isUUID } from "class-validator";
import { StrictProductItemParser } from "./types/params/factory.param";

type InternalRuleRecordParams = {
    costId : string;
    first : string;
}

@Injectable()
export default class RuleFactory {

    /**
     * 
     * PARSER
     * 
     */

    /**
     * 
     * @param param 
     * @returns 
     */

    parseToInternalRule(
        param: ReceivedRuleParams
    ): InternalRuleParams {

        const {
            parentsId: internalParentsId,
            childrenId: internalChildrenId,
            costId,
            internalId,
            ...rest
        } = param;

        if(!costId){
            throw new BadRequestException("Cost id is required");
        }

        if(!internalId){
            throw new BadRequestException("Rule's internal id is required");
        }

        return {
            ...rest,

            costId,
            internalId,

            parentsId: [],
            internalParentsId,

            childrenId: [],
            internalChildrenId,
        }

    }

    /**
     * 
     * @param record 
     * @param params 
     * @returns 
     */

    buildInternalRules(
        record: Record<string, ReceivedRuleParams>,
        params : InternalRuleRecordParams
    ): InternalRuleParams[] {

        const rules : InternalRuleParams[] = [];
        const {
            first,
            costId
        } = params;

        for (const [key, param] of Object.entries(record)) {

            const rule = this.parseToInternalRule({
                ...param,
                first : key === first,
                costId,
                internalId : key
            });
            rules.push(rule)
        }

        return rules;

    }

    /**
     * 
     * @param rule 
     * @returns 
     */

    parseToRuleSeed(
        rule : Rule
    ) : RuleSeed {
        const {
            id,
            operator,
            tags,
            items,
            parent,
            children,
            first
        } = rule; 

        const seed : RuleSeed = {
            operator,
            tags,
            id,
            first,
            result : new RuleResult(
                operator,
            )
        }; 

        if(items?.length){
            seed.itemsId = (hasObjectValues(items))
            ? items.map(({id}) => id)
            : items.map(id => String(id))
        }

        if(!isObject(parent) && isUUID(parent)){
            seed.parentId = String(parent);
        }

        if(isObject(parent) && parent?.id){
            seed.parentId = parent.id;
        }

        if(children?.length){
            seed.childrenId = (hasObjectValues(children))
            ? children.map(({id}) => id)
            : children.map(id => String(id))
        }

        return seed;

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    parseToStrictProductItemParams(
        params : StrictProductItemParser
    ) : StrictProductItemParams {
        const {
            baseCost,
            ...rest
        } = params;

        if(!baseCost){
            throw new BadRequestException("Param has not baseCost value")
        }

        return {
            ...rest,
            baseCost
        }
    }

    /**
     * 
     * MAPPING
     * 
     */

    /**
     * 
     * @param payloads 
     * @returns 
     */

    mapEntityIdByInternalId(
        ...payloads : SaveRulePayload[]
    ) : Map<string, string> {

        const map = new Map<string, string>();

        payloads.forEach(({internalRule, ruleEntity}) => {
            map.set(
                internalRule.internalId,
                ruleEntity.id
            )
        })

        return map;
    }

    mapItemsSeedById(
        itemsSeed : ItemSeed[]
    ){
        const map = new Map<string, ItemSeed>();
        
        itemsSeed.forEach(seed => {
            map.set(seed.id, seed);
        })

        return map;
        
    }

    mapRulesSeedById(
        rulesSeed : RuleSeed[]
    ){
        const map = new Map<string, RuleSeed>();

        rulesSeed.forEach(seed => {
            map.set(seed.id, seed);
        })

        return map;
    }

    /**
     * 
     * PREPARATORS
     * 
     */

    /**
     * 
     * @param entities 
     * @returns 
     */

    prepareCreateResponse(
        payload : SaveRulePayload[]
    ) {

        const response: CreateResponse = {
            rules: new Map()
        };

        for(const {internalRule, ruleEntity} of payload){

            if (ruleEntity.first) {
                response.firstRule = ruleEntity.id;
            }
            response.rules.set(internalRule.internalId, ruleEntity.id);

        }

        return response;

    }

    prepareItemSeedFromContext(
        context : ItemContext
    ) : ItemSeed{

        const {
            item,
            inputData
        } = context;

        let {
            type,
            name,
            tax,
            constant
        } = item;

        let value = item.defaultValue;

        if(inputData){
            value = inputData.value;
        }else if(type === ItemType.CONSTANT){
            if(!constant?.value){
                throw new BadRequestException("Constant value is required");
            }
            value = constant.value;
        }else if(type === ItemType.TAX){
            const {
                valueType
            } = tax;

            let taxValue = 0;

            if(!valueType){
                throw new BadRequestException("Tax value type is required");
            }

            if(valueType === TaxValueType.AMOUNT){
                if(!tax?.amount){
                    throw new BadRequestException("Tax amount is required");
                }
                taxValue = tax.amount;
            }

            if(valueType === TaxValueType.PERCENTAGE){
                if(!tax?.percentage){
                    throw new BadRequestException("Tax percentage is required");
                }
                taxValue = tax.percentage;
            }

            value = taxValue;
        }

        if(!name){
            if(type === ItemType.CONSTANT){
                name = constant.name ?? "";
            }
            else if(type === ItemType.TAX){
                name = tax.alias ?? "";
            }else{
                name = "";
            }
        }
        
        return {
            ...item,
            value,
            name
        }

    }

}