export enum MovementReason {
    SELL = "SELL",
    FULFILLED_RESERVE = "FULFILLED_RESERVE",
    REFUND = "REFUND",

    WITHDRAWAL = "WITHDRAWAL",
    RECEIPT = "RECEIPT",
    
    TRANSFER = "TRANSFER",
    PRODUCTION = "PRODUCTION",
}

export const MovementReasonList = Object.values(MovementReason);