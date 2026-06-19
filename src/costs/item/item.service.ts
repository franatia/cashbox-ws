import {BaseService} from "@/common/models/crud/base-service.crud";
import ItemQuery from "./item.query";
import { CreateParams, ItemTypeValidatorParams, PutParams } from "./types/params/service.types";
import { BadRequestException, Injectable } from "@nestjs/common";
import { isEmptyObject } from "@/common/helpers/object.helper";
import { ItemType } from "../enums/item.enum";

@Injectable()
export class ItemService implements BaseService {

    constructor(
        private readonly query: ItemQuery
    ) { }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param params 
     */

    async validateItemTypeConsistence(
        params: ItemTypeValidatorParams
    ) {
        const {
            id,
            ...rest
        } = params;

        if(isEmptyObject(rest)) return;

        let {
            type,
            constantId,
            taxId,
        } = rest;

        if(!type && id){
            const entity = await this.query.findOneOrFail({
                where : {
                    id
                },
                select : {
                    type : true
                }
            });
            type = entity.type;
        }

        if (type === ItemType.CONSTANT) {
            if (!constantId) {
                throw new BadRequestException("Constant id was not provided");
            }
            params.taxId = undefined;
        }

        if (type === ItemType.TAX) {
            if (!taxId) {
                throw new BadRequestException("Tax id was not provided");
            }

            params.constantId = undefined;

        }

    }

    /**
     * 
     * CREATORS
     * 
     */

    /**
     * 
     * @param params
     * @returns 
     */

    async create(
        params: CreateParams
    ) {

        const {
            constantId,
            taxId,
            type
        } = params;

        await this.validateItemTypeConsistence({
            constantId,
            taxId,
            type
        })

        return this.query.saveOne(
            params
        )

    }

    /**
     * 
     * PUT
     * 
     */

    /**
     * 
     * @param params 
     */

    async put(
        id : string,
        params: PutParams
    ){

        const {
            constantId,
            taxId,
            type
        } = params; 

        await this.validateItemTypeConsistence({
            id,
            constantId,
            taxId,
            type
        })

        return this.query.updateOne(
            id,
            params
        )

    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param id 
     */

    delete(
        id : string
    ){
        return this.query.deleteOne(
            id
        )
    }   

}