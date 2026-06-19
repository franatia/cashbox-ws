import { LotStatus, LotType } from "@/stock/enums/lot.enum";

export type OrmParams = {
    id ?: string;

    stockItemId ?: string;
    reserveId ?: string;
    costSnapshotId ?: string;
    
    quantity ?: number;
    remaining ?: number;
    status ?: LotStatus;
    type ?: LotType;
    expiresAt ?: Date;
}

export type SaveParams = {
    
    stockItemId : string;
    
    reserveId ?: string;

    quantity : number;
    remaining : number;
    status : LotStatus;
    type : LotType;
    expiresAt ?: Date;

    costSnapshotId ?: string;
}

export type UpdateParams = {

    quantity ?: number;
    remaining ?: number;
    status ?: LotStatus;

}