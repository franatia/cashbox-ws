import { BadRequestException, Injectable } from "@nestjs/common";
import ComposityQuery, { OrmParams } from "./composity.query";
import CreateDto from "./dto/create.dto";
import CreateManyDto from "./dto/create-many.dto";
import UpdateDto from "./dto/update.dto";
import { In } from "typeorm";

@Injectable()
export default class ComposityService {
    constructor(
        private readonly query : ComposityQuery
    ){}

    /**
     * 
     * RELATIONS
     * 
     */

    /**
     * 
     * @param id 
     * @param projectId 
     * @param throwable 
     * @returns 
     */

    async linkedToProject(
        id : string,
        projectId : string,
        throwable : boolean = true
    ){
        const exists = await this.query.exists({
            id,
            product : {
                project : {
                    id : projectId
                }
            }
        })

        if(!exists && throwable){
            throw new BadRequestException("Composity is not linked with product");
        }

        return exists;
    }

    async productHasNotComposityItems(
        productId : string,
        itemsId : string[],
        throwable : boolean = true
    ){
        const count = await this.query.count({
            product : {
                id : productId
            },
            item : {
                id : In(itemsId)
            }
        })

        const some = count > 0;

        if(some && throwable){
            throw new BadRequestException("Some items were already added as composity");
        }

        return !some;

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param dto 
     * @returns 
     */

    makeOrmParamsFromManyDto(
        dto : CreateManyDto
    ) : OrmParams[] {
        const {
            items,
            productId
        } = dto;

        return items.map<OrmParams>(({quantity, id}) => ({
            itemId : id,
            productId,
            quantity
        }));
    }

    /**
     * 
     * CREATE
     * 
     */

    /**
     * 
     * @param dto 
     * @returns 
     */

    create(
        dto : CreateDto
    ){
        return this.query.saveOne(dto);
    }

    /**
     * 
     * @param dto 
     * @returns 
     */

    createMany(
        dto : CreateManyDto
    ){

        const params : OrmParams[] = this.makeOrmParamsFromManyDto(dto);

        return this.query.saveMany(params);

    }

    /**
     * 
     * PUT
     * 
     */

    /**
     * 
     * @param composityId 
     * @param dto 
     * @returns 
     */

    put(
        composityId : string,
        dto : UpdateDto
    ){
        return this.query.updateOne(
            composityId,
            dto
        )
    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param composityId 
     * @returns 
     */

    async delete(
        composityId : string
    ){
        await this.query.deleteById(composityId);

        return {
            deletedComposity : composityId
        }
    }

}