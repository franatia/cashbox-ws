export enum LotStatus {
    PENDING = "PENDING",
    PRODUCTION = "PRODUCTION",
    AVAILABLE = "AVAILABLE",
    OUT = "OUT",

    BLOCK = "BLOCK",
    CANCELLED = "CANCELLED"
}

export const LotStatusList = Object.values(LotStatus);

export enum LotType {
    FREE = "FREE",
    RESERVED = "RESERVED"
}

export const LotTypeList = Object.values(LotType);
