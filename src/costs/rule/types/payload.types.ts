import Rule from "@/costs/entities/rule.entity"
import { InternalRuleParams } from "./rule.types"

/**
 * 
 * Here we save the data structures that will be returned
 * in functions that provide specifical services to upper
 * functions
 * 
 */

export type SaveRulePayload = {
    internalRule: InternalRuleParams,
    ruleEntity: Rule
}

export type LinePairPayload = {
    itemId: string,
    parentId?: string,
}