import { LotParams } from "@/stock/movement/types/params/service.params";
import { SaveParams } from "./query.params";
import { LotTransferStatus, LotTransferType } from "@/stock/transfer-item/types/lot.types";

export type CreateParams = SaveParams & {
    items : ItemParams[]
}

export type ItemParams = {

    quantity : number;

    productItemId : string;

    lots ?: LotParams[];
    lotType ?: LotTransferType;
    lotStatus ?: LotTransferStatus;

}

export type CreateTransferItemsParams = {
    items : ItemParams[];
    transferId : string,
    userCreatorId : string
}