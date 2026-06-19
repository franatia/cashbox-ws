import { Operator } from "@/stock/enums/operator.enum";

export type CreateParams = {
    projectId : string;
    productItemId : string;
    quantity ?: number;
}

export type QueryUpdateParams = {
    quantity : number;
}

export type UpdateParams = {
    quantity : number;
    operator ?: Operator;
}

export type UpdateUnitParams = {
    operator : Operator;
} & UnitParams

export type UnitParams = {
    quantity ?: number;
    remaining ?: number;
}

export type StockDataPayload = {
    quantity : number;
    remaining : number;
}