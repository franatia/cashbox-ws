import { RuleOperator, RuleTag } from "@/costs/enums/rule.enum"
import { ReceivedRuleParams } from "../types/rule.types"

export enum RulesTemplateKeys {
    FIRST = "first",
    FIX_TAXES = "fixTaxes",
    SUMMATION = "summation",
    NET_COST = "netCost",
    PARTIAL_NET_COST = "partialNetCost",
    TAXES = "taxes",
    BASE_COST = "baseCost",
    TARIFFS = "tariffs"
}

export const rulesTemplate : Record<string, ReceivedRuleParams> = {
    [RulesTemplateKeys.FIRST]: {
        "operator": RuleOperator.ADDITION,
        "tags": [
            RuleTag.ACQUISITION_COST
        ],
        "childrenId": [
            RulesTemplateKeys.FIX_TAXES,
            RulesTemplateKeys.SUMMATION
        ],
        "first": true,
        //"name" : "Costo Total"
    },
    [RulesTemplateKeys.FIX_TAXES]: {
        "operator": RuleOperator.ADDITION,
        "tags": [
            RuleTag.FIX_TAX,
            RuleTag.ITEM_CONTAINER
        ],
        //"name" : "Impuestos Fijos"
    },
    [RulesTemplateKeys.SUMMATION]: {
        "operator": RuleOperator.SUMMATION,
        "tags": [
            RuleTag.PARTIAL_ACQUISITION_COST
        ],
        "childrenId": [
            RulesTemplateKeys.NET_COST
        ],
        //"name" : "Costo Total Parcial"
    },
    [RulesTemplateKeys.NET_COST]: {
        "operator": RuleOperator.ADDITION,
        "tags": [
            RuleTag.PARTIAL_ACQUISITION_COST
        ],
        "childrenId": [
            RulesTemplateKeys.PARTIAL_NET_COST,
            RulesTemplateKeys.TARIFFS
        ],
        //"name" : "Costo Neto"
    },
    [RulesTemplateKeys.PARTIAL_NET_COST]: {
        "operator": RuleOperator.MULTIPLICATION,
        "tags": [
            RuleTag.PARTIAL_ACQUISITION_COST
        ],
        "childrenId": [
            RulesTemplateKeys.TAXES,
            RulesTemplateKeys.BASE_COST
        ],
        //"name" : "Costo Neto Parcial"
    },
    [RulesTemplateKeys.TAXES]: {
        "operator": RuleOperator.ADDITION,
        "tags": [
            RuleTag.TAX,
            RuleTag.ITEM_CONTAINER
        ],
        //"name" : "Impuestos"
    },
    [RulesTemplateKeys.BASE_COST]: {
        "operator": RuleOperator.ADDITION,
        "tags": [
            RuleTag.TAX_BASE,
            RuleTag.PRE_TAX_ACQUISITION_COST,
            RuleTag.ITEM_CONTAINER
        ],
        //"name" : "Costo Base"
    },
    [RulesTemplateKeys.TARIFFS]: {
        "operator": RuleOperator.ADDITION,
        "tags": [
            RuleTag.TAX_EXEMPT,
            RuleTag.SPECIFIC_TAX,
            RuleTag.ITEM_CONTAINER
        ],
        //"name" : "Tarifas"
    }
}