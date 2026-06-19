import { LotStatus } from "@/stock/enums/lot.enum";
import { LotSubtraction } from "./service.payload";

export type PrepareUpdateUnitPayload = {
    quantity ?: number;
    remaining ?: number;
    status ?: LotStatus;
}

export type SubtractionPayload = {
    subtractionQuantity : number;
    subtractions : LotSubtraction[]
};