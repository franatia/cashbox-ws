import { RuleOperator, RuleTag } from "@/costs/enums/rule.enum";
import RuleResult from "../models/rule-result.model";

/**
 * 
 * PERSISTENCE STRUCTURES
 * 
 */

export type InternalRuleRecord = Record<string, InternalRuleParams>

export type InternalRuleParams = {
    id ?: string;
    internalId : string;
    
    operator : RuleOperator;
    tags : RuleTag[];

    costId : string;
    itemsId ?: string[];
    
    parentsId ?: string[];
    internalParentsId ?: string[];
    
    childrenId ?: string[];
    internalChildrenId ?: string[];
    
    first ?: boolean;
} 

export type ReceivedRuleParams = {
    operator: RuleOperator;
    tags: RuleTag[];

    internalId?: string;
    costId?: string;
    itemsId?: string[];
    parentsId?: string[];
    childrenId?: string[];
    first?: boolean;
}

/**
 * 
 * CALCULATION SEED
 * 
 */

export enum RuleResultSource {
    ITEMS = "ITEMS",
    CHILD = "CHILD"
}

export type RulePartialResult = {
    source : RuleResultSource,
    value : number,
    id ?: string
}

export type RuleSeed = {
    id : string,
    operator : RuleOperator,
    first : boolean,
    tags : RuleTag[];
    itemsId ?: string[];
    parentId ?: string;
    childrenId ?: string[];
    result : RuleResult;
}