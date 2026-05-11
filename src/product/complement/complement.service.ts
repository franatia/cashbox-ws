import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Complement, ComplementType } from "../entities/complement.entity";
import { ComplementItem } from "../entities/complement-item.entity";
import { CreateDto } from "./dto/create.dto";
import { CreateItemsDto } from "./dto/create-items.dto";
import UpdateDto from "./dto/update.dto";
import UpdatePriceListDto from "./dto/update-price-list.dto";
import ComplementQuery from "./complement.query";

@Injectable()
export class ComplementService {

    constructor(
        private readonly query: ComplementQuery
    ) { }

    /**
     * 
     * LINKERS
     * 
     */

    async linkedToProject(
        id: string,
        projectId: string,
        throwable: boolean = true
    ) {
        const exists = await this.query.exists({
            id,
            product: {
                project: {
                    id: projectId
                }
            }
        })

        if (!exists && throwable) {
            throw new BadRequestException("Complement is not related with Project");
        }

        return exists;

    }

    /**
     * 
     * CREATORS
     * 
     */

    /**
     * 
     * Crea los composity de un product dado
     * 
     * @param dto 
     * @returns 
     */

    async create(

        dto: CreateDto

    ) {

        const {
            itemsId,
            ...complementParams
        } = dto;

        const complement = await this.query.saveOne(complementParams);

        const items = await this.createItems({
            complementId: complement.id,
            itemsId
        })

        return {
            ...complement,
            items
        }

    }

    /**
     * 
     * Crea los composity items dado
     * un composity id
     * 
     * @param dto 
     * @returns 
     */

    async createItems(
        {
            complementId,
            itemsId
        }: CreateItemsDto
    ) {

        const complementItems = await this.query.saveItems({
            complementId,
            productItemsId : itemsId
        });

        return complementItems;

    }

    /**
     * 
     * PUT
     * 
     */

    /**
     * 
     * @param complementId 
     * @param dto 
     * @returns 
     */

    async put(
        complementId: string,
        dto: UpdateDto
    ) {

        const {
            priceListId,
            ...rest
        } = dto;

        if (priceListId) {
            await this.query.setPriceList(
                complementId,
                priceListId
            );
        }

        if(!Object.entries(rest).length) return {};

        return this.query.updateOne(
            complementId,
            rest
        );

    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param complementId 
     * @returns 
     */

    async delete(
        complementId: string
    ) {
        return this.query.deleteOne({
            id: complementId
        })
    }

    /**
     * 
     * @param itemId 
     * @returns 
     */

    async deleteItem(
        itemId: string
    ) {
        return this.query.deleteOneItem({
            id: itemId
        })
    }


}