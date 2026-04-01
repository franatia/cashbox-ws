export enum PaymentListStatus {
    PENDING = "PENDING",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    CONFIRMED = "CONFIRMED",
    REFUNDED = "REFUNDED"
}

export enum PaymentMethod {
    CASH = "CASH",
    TRANSFER = "TRANSFER",
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    FAILED = "FAILED",
    CANCELED = "CANCELED"
}