import { Movement } from "@/stock/entities/movement.entity";
import { LotParams } from "@/stock/movement/types/params/service.params";
import { DeepPartial } from "typeorm";

export type GetStockItemsPayload = {
    sourceStockItemId: string;
    targetStockItemId: string;
}

export type SourceMovementPayload = MovementPayload;

export type TargetMovementPayload = MovementPayload;

export type MovementPayload = {
    id: string,
    lotId: string,
    quantity: number,
    stockItemId : string
}

export type CreateTargetLotPayload = {
    lot: LotParams,
    sourceLot: LotParams
}

export type ResolveCreateTargetLotsPayload = {
    createPayloads: CreateTargetLotPayload[],
    lots: LotParams[]
}

export type ResolveTargetMovementsPayload = {
    movements: TargetMovementPayload[],
    lotPayloads: CreateTargetLotPayload[]
}