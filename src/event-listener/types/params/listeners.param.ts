import { Operator } from "@/stock/enums/operator.enum";

export type NodeCreatedParam = string;

export type StocksCreatedParam = string[];

export type ProductItemsCreatedParam = string[];

export type LotsCreatedParam = LotsCreatedData[];

type LotsCreatedData = {
    id : string;
    stockItemId : string;
    quantity : number;
}

export type StockItemUnitUpdatedParam = {
    id : string;
    quantity ?: number;
    remaining ?: number;
    operator : Operator
}

export type LotUnitUpdatedParam = {
    id : string;
    quantity ?: number;
    remaining ?: number;
    operator : Operator;
}