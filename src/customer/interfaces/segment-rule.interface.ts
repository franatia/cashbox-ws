export interface SegmentRuleItem {
    type : string,
    amount : number | null,
    days : number | null,
    country : string | null,
    city : string | null
}

export interface SegmentRuleOperator {
    type : "AND" | "OR",
    items : (SegmentRuleItem | SegmentRuleOperator)[]
}