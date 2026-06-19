import { LotStatus, LotType } from "@/stock/enums/lot.enum";

export type FindByOptions = {
    status ?: LotStatus;
    type ?: LotType;
    stockItemId : string;
    lotsId?: string[];
} & AccumulatedOptions;

export type AccumulatedOptions = {
    quantityAccumulated?: number;
    remainingAccumulated?: number;
}