import { LotStatus } from "@/stock/enums/lot.enum"
import { ResolveUnitParams } from "@/stock/helpers/types/unit.type"

export type PrepareUpdateUnitParams = ResolveUnitParams & {
    currentStatus : LotStatus
}

export type PrepareStatusParams = {
    currentStatus : LotStatus,
    quantity ?: number,
    remaining ?: number
}