import { Operator } from "@/stock/enums/operator.enum";
import { UpdateParams as BaseUpdateParams } from "./query.params";
import { LotStatus, LotType } from "@/stock/enums/lot.enum";
import { GetLotsOptions as AccGetLotsOptions} from "@/stock/lot-accumulated/types/params/service.params";
import { PrepareUpdateUnitParams } from "./factory.params";
import { CalculateParams } from "@/costs/core/types/params/service.params";

export type CreateParams = CalculateParams & {

    reserveId ?: string;

    status : LotStatus;
    type : LotType;
    expiresAt ?: Date;
    
}

export type CreateByLotSeedParams = {
    lotId : string;
    stockItemId : string;
}

export type UpdateParams = BaseUpdateParams & {
    operator ?: Operator
};

export type QueryUpdateParams = BaseUpdateParams;

export type UpdateUnitParams = {
    quantity ?: number;
    remaining ?: number;
    operator : Operator;
}

export type UnitParams = {
    quantity ?: number;
    remaining ?: number;
}



export type GetLotsFilterParams = {
    type : LotType,
    status : LotStatus
}

export type SubtractionOptions = AccGetLotsOptions;

export type ResolveSubtractPayloadParams = {
    type ?: LotType,
    status ?: LotStatus,
    quantity : number,
    stockItemId : string,
}

export type GetByOptions = AccGetLotsOptions;

export type ResolveUpdateUnitParams = PrepareUpdateUnitParams;