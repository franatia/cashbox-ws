import { CostRuleSeed } from "@/costs/rule/models/seed.model";

export type CalculatePayload = {
    cost : number;
    quantity : number;
    unitCost : number;
    seed : CostRuleSeed
}