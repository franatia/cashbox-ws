import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { OrmParams, SaveParams } from "./types/params/query.params";
import { notObjectEmpty } from "@/common/helpers/object.helper";
import { TransferItem } from "../entities/transfer/transfer-item.entity";

@Injectable()
export class TransferItemQuery extends BaseQuery<TransferItem> {

    constructor(
        @InjectRepository(TransferItem)
        repo : Repository<TransferItem>
    ){
        super(TransferItem, repo);
    }

    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    async saveOne(
        params : SaveParams
    ){

        notObjectEmpty(params);

        const orm = this.makeOrm(params);

        const raw =  await this.save(orm);

        if(!raw.length){
            throw new BadRequestException(
                "Transfer item was not saved"
            );
        }

        return raw[0];

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    makeOrm(
        params : OrmParams
    ): DeepPartial<TransferItem> {
        
        const { 
            movementsLinkersId,
            productItemId,
            transferId,
            ...rest
        } = params;

        const orm : DeepPartial<TransferItem> = {
            ...rest
        };

        if(movementsLinkersId){
            orm.movementsLinkers = movementsLinkersId.map(id => ({
                id
            }));
        }

        if(productItemId){
            orm.productItem = {
                id : productItemId
            };
        }

        if(transferId){
            orm.transfer = {
                id : transferId
            };
        }

        return orm;

    }

}