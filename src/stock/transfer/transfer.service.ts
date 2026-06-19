import {BaseService} from "@/common/models/crud/base-service.crud";
import { TransferQuery } from "./transfer.query";
import { CreateParams, CreateTransferItemsParams } from "./types/params/service.params";
import { TransferItemService } from "../transfer-item/transfer-item.service";
import { CreatePayload } from "./types/payloads/service.payload";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class TransferService implements BaseService {

    constructor(
        private readonly query : TransferQuery,

        private readonly transferItemService : TransferItemService
    ){}

    /**
     * 
     * @param params 
     * @returns 
     */

    async create(
        params : CreateParams
    ) : Promise<CreatePayload>{

        const {
            items,
            ...rest
        } = params;

        const transfer = await this.query.saveOne(rest);

        const transferItems = await this.createTransferItems({
            items,
            transferId : transfer.id,
            userCreatorId : rest.userCreatorId
        });

        return {
            ...transfer,
            items : transferItems
        }

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private async createTransferItems(
        params : CreateTransferItemsParams
    ){

        const {
            items,
            transferId,
            userCreatorId
        } = params;

        const transfers : any[] = [];

        for(const item of items){

            const transferItem = await this.transferItemService.create({
                ...item,
                transferId,
                userCreatorId,
            })

            transfers.push(transferItem);

        }

        return transfers;

    }

}