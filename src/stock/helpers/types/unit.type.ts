import { Operator } from "@/stock/enums/operator.enum";

export type ResolveUnitParams = {
    operator: Operator,

    quantity ?: number;
    currentQuantity ?: number;

    amount?: number;
    currentAmount ?: number;

    remaining ?: number;
    currentRemaining ?: number;
}

export type ResolveUnitPayload = {
    quantity ?: number;
    amount ?: number;
    remaining ?: number;
}

export type VerifyUnitPayload = ResolveUnitPayload & {
    currentQuantity ?: number;
    currentRemaining ?: number;
}