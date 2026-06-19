import { LotStatus, LotType } from "@/stock/enums/lot.enum";

export type LotTransferStatus = (
    LotStatus.AVAILABLE |
    LotStatus.BLOCK |
    LotStatus.PENDING | 
    LotStatus.PRODUCTION
)

export const LotTransferStatusList = [
    LotStatus.AVAILABLE,
    LotStatus.BLOCK,
    LotStatus.PENDING, 
    LotStatus.PRODUCTION
]

export type LotTransferType = (
    LotType.FREE | 
    LotType.RESERVED
)

export const LotTransferTypeList = [
    LotType.FREE,
    LotType.RESERVED
]