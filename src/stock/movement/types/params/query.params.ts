import { OperationDirection } from "@/common/enum/operation.enum";
import { MovementReason } from "@/stock/enums/movement.enum";

export type OrmParams = {
    id ?: string;

    userCreatorId ?: string;
    stockItemId ?: string;
    lotId ?: string;
    transferItemId ?: string;

    quantity ?: number;
    direction ?: OperationDirection;
    reason ?: MovementReason;
}

export type SaveParams = {
    
    quantity : number;
    direction : OperationDirection;
    reason : MovementReason;

    userCreatorId ?: string;
    stockItemId : string;
    lotId : string;
    transferItemId ?: string;

}

export type UpdateParams = {

    transferItemId ?: string;

}