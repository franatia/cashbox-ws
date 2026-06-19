import { LotStatus, LotType } from "@/stock/enums/lot.enum";
import { Operator } from "../../../enums/operator.enum";
import { LotParams } from "@/stock/movement/types/params/service.params";

export type CreateParams = {
    stockId : string;
    nodeId : string;
}

export type CreateManyByProjectContextParams = {
    projectId : string;
    nodeId : string;
}

export type QueryUpdateParams = {
    quantity ?: number;
}

export type UpdateParams = {
    quantity ?: number;
    remaining ?: number;
    operator ?: Operator;
}

export type UpdateUnitParams = {
    operator : Operator;
} & UnitParams

export type UnitParams = {
    quantity ?: number;
    amount ?: number;
    remaining ?: number;
}

export type ItemDataPayload = {
    quantity : number;
    remaining : number;
}

export type SubtractOptions = {
    lotStatus ?: LotStatus;
    lotType ?: LotType;
    lots ?: LotParams[];
    quantity ?: number;
}

export type ResolveSubtractOptions = {
    lotStatus ?: LotStatus;
    lotType ?: LotType;
    lots ?: LotParams[];
    quantity ?: number;
    itemId : string;
}