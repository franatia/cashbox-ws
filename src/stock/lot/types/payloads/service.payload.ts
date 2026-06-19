import { LotStatus } from "@/stock/enums/lot.enum";

export type LotDataPayload = {
    quantity : number;
    remaining : number;
    status : LotStatus;
}

export type LotSubtraction = {
    lotId : string;
    subtraction : number;
}

export type AdditionPayload = {
    lotId : string;
    addition : number;
}