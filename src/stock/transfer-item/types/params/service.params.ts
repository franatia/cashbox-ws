import { LotStatus, LotType } from "@/stock/enums/lot.enum";
import { LotTransferStatus, LotTransferType } from "../lot.types";
import { SourceMovementPayload } from "../payload/service.payload";
import { LotParams } from "@/stock/movement/types/params/service.params";
import { CreateParams as CreateParamsMovLinker } from "@/stock/movements-linker/types/params/service.params";

export type CreateParams = {
    
    quantity : number;

    transferId : string,
    productItemId : string;
    userCreatorId : string;
        
    lots ?: LotParams[];
    lotType ?: LotTransferType;
    lotStatus ?: LotTransferStatus;

}

export type CreateMovementsLinkerParams = CreateParamsMovLinker;

export type ResolveMovementsParams = {

    quantity : number;

    userCreatorId : string;
    itemId : string;
    productItemId : string;
    transferId : string;

    lots ?: LotParams[];
    lotType ?: LotType;
    lotStatus ?: LotStatus;

}

export type CreateMovementsParams = {
    
    quantity : number;

    userCreatorId : string;
    sourceStockItemId : string;
    targetStockItemId : string;
    itemId : string;


    lots ?: LotParams[];
    lotType ?: LotType;
    lotStatus ?: LotStatus;

}

export type ResolveSourceMovementsParams = CreateMovementsParams;

export type CreateSourceMovementsParams = {

    quantity : number;

    userCreatorId : string;
    stockItemId : string;
    itemId : string;

    lots ?: LotParams[];
    lotType ?: LotType;
    lotStatus ?: LotStatus;

}

export type CreateTargetMovementsParams = {
    
    userCreatorId : string;
    stockItemId : string;
    itemId : string;

    lots : LotParams[];

}

export type ResolveTargetMovementsParams = {
    
    quantity : number;

    userCreatorId : string;
    stockItemId : string;
    itemId : string;

    sourceMovements : SourceMovementPayload[]
}

export type TargetLotPayload = {}