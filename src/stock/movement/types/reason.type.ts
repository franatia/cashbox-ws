import { MovementReason } from "@/stock/enums/movement.enum";

export type SubtractionReason = (
    MovementReason.SELL | 
    MovementReason.PRODUCTION | 
    MovementReason.TRANSFER | 
    MovementReason.WITHDRAWAL |
    MovementReason.FULFILLED_RESERVE
);

export const SubtractionReasonList = [
    MovementReason.SELL,
    MovementReason.PRODUCTION, 
    MovementReason.TRANSFER, 
    MovementReason.WITHDRAWAL,
    MovementReason.FULFILLED_RESERVE
]

export type AdditionReason = (
    MovementReason.REFUND |
    MovementReason.TRANSFER |
    MovementReason.RECEIPT
)

export const AdditionReasonList = [
    MovementReason.REFUND,
    MovementReason.TRANSFER,
    MovementReason.RECEIPT
]