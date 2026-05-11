import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Composity from "../entities/composity.entity";
import { DeepPartial, FindOneOptions, FindOptions, FindOptionsWhere, Repository } from "typeorm";
import { isEmptyObjectAndThrow } from "@/common/helpers/params.helper";

export type OrmParams = {
    productId ?: string,
    quantity ?: number,
    itemId ?: string,
}

type SafeUpdateOrm = {
    quantity ?: number
}

@Injectable()
export default class ComposityQuery {
    
    constructor(
        @InjectRepository(Composity)
        private readonly repo : Repository<Composity>
    ){}

    /**
     * 
     * FIND
     * 
     */

    findOne(
        options : FindOneOptions<Composity>
    ){
        return this.repo.findOne(options);
    }

    async findOneOrFail(
        options : FindOneOptions<Composity>
    ) : Promise<Composity> {

        const composity = await this.findOne(options);
    
        if(!composity){
            throw new BadRequestException("Composity does not exists");
        }

        return composity;
    }

    /**
     * 
     * EXISTS
     * 
     */

    exists(
        where : FindOptionsWhere<Composity>
    ){
        return this.repo.exists({
            where
        })
    }

    /**
     * 
     * COUNT
     * 
     */

    count(
        where : FindOptionsWhere<Composity>
    ){
        return this.repo.count({
            where
        })
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

    saveOne(
        params : OrmParams
    ){
        isEmptyObjectAndThrow(params);

        const orm = this.makeOrm(params);

        return this.repo.save(orm);
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    saveMany(
        params : OrmParams[]
    ){
        
        params.forEach(param => (isEmptyObjectAndThrow(param)));

        const orm = this.makeManyOrm(params);

        return this.repo.save(orm);

    }

    /**
     * 
     * UPDATE
     * 
     */

    /**
     * 
     * @param composityId 
     * @param orm 
     * @param returning 
     * @returns 
     */

    async updateOne(
        composityId : string,
        orm : SafeUpdateOrm,
        returning : string[] | string = "*"
    ){
        
        isEmptyObjectAndThrow(orm);

        const {raw, affected} = await this.repo.createQueryBuilder()
            .update(Composity)
            .set(orm) 
            .where("id = :composityId", {
                composityId
            })
            .returning(returning)
            .execute();

        if(!affected){
            throw new BadRequestException("Composity was not affected");
        }

        const composity = this.repo.merge(
            new Composity(),
            raw[0]
        )

        return composity;

    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param where 
     * @returns 
     */

    delete(
        where : FindOptionsWhere<Composity>
    ){
        return this.repo.delete(where);
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    deleteById(
        id : string
    ){
        return this.repo.delete({
            id
        });
    }

    /**
     * 
     * ORM
     * 
     */
    
    /**
     * 
     * @param params 
     * @returns 
     */

    makeOrm(
        params : OrmParams
    ){
        const {
            itemId,
            productId,
            quantity
        } = params

        const orm : DeepPartial<Composity> = {};

        if(quantity){
            orm.quantity = quantity;
        }

        if(productId){
            orm.product = {
                id : productId
            }
        }

        if(itemId){
            orm.item = {
                id : itemId
            }
        }

        return orm;

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    makeManyOrm(
        params : OrmParams[]
    ){
        return params.map(param => (this.makeOrm(param)));
    }

}