import { LotStatus, LotType } from "@/stock/enums/lot.enum";
import { AdditionReason, SubtractionReason } from "../reason.type";
import { MovementReason } from "@/stock/enums/movement.enum";
import { OperationDirection } from "@/common/enum/operation.enum";

export type CreateParams = {
    
    quantity ?: number;
    reason: MovementReason;
    direction: OperationDirection;

    userCreatorId?: string;
    stockItemId: string;
    transferItemId?: string;

    lots?: LotParams[];
    lotType?: LotType;
    lotStatus?: LotStatus;
    
};

export type LotParams = {

    id : string;
    quantity : number;

}

export type ResolveMovementParams = {

    quantity ?: number;
    reason : MovementReason;
    direction : OperationDirection;

    stockItemId : string;
    lots?: LotParams[];
    lotType ?: LotType;
    lotStatus ?: LotStatus;

}

export type ResolveSubtractionParams = {
    reason : SubtractionReason;
    quantity ?: number;

    stockItemId : string;
    
    lots?: LotParams[];
    lotType ?: LotType;
    lotStatus ?: LotStatus;
}

export type ResolveAdditionParams = {
    reason : AdditionReason;

    lots : LotParams[];
}