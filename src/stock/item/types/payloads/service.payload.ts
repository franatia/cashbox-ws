import { AdditionPayload as LotAdditionPayload, LotSubtraction } from "@/stock/lot/types/payloads/service.payload"

export type SubtractionPayload = LotSubtraction[];
export type AdditionPayload = LotAdditionPayload[];

export type ResolveAdditionPayload = LotAdditionPayload[]