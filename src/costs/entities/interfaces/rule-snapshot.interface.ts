import { RuleOperator, RuleTag } from "../../enums/rule.enum";
import { CostTag } from "../../enums/tag.enum";

export interface RuleMetadataSnapshot {
    rules : Record<string, RuleSnapshot>,
    header : RuleSnapshot
}

export interface RuleSnapshot {

    tags ?: RuleTag[];
    result : number;
    operator : RuleOperator;
    items ?: RuleItemSnapshot[];
    children ?: string[];
    parent ?: string[]

}

export interface RuleItemSnapshot {
    tags ?: CostTag[],
    value : number,
    name : string,
    denomination ?: string,
    authorityReferenceCode ?: string,
}

