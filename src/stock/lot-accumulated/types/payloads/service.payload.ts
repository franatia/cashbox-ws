import { LotAccumulatedView } from "@/stock/entities/lot/lot-accumulated.view"

export type ResolveGetLotsPayload = {
    lots : LotAccumulatedView[],
    quantity : number
}