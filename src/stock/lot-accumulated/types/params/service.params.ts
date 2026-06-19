import { LotStatus, LotType } from "@/stock/enums/lot.enum";
import { LotParams } from "@/stock/movement/types/params/service.params";

export type GetLotsOptions = {
    
    quantity ?: number;
    status ?: LotStatus;
    type ?: LotType;
    lots?: LotParams[];

    stockItemId : string;
}

export type ResolveFindByLotsParams = {

    lots : LotParams[];

    stockItemId : string;

}

export enum GetLotsType {
    QUANTITY = "QUANTITY",
    REMAINING = "REMAINING",
}