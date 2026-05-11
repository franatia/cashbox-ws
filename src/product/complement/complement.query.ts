import { InjectRepository } from "@nestjs/typeorm";
import { Complement, ComplementType } from "../entities/complement.entity";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ComplementItem } from "../entities/complement-item.entity";

/**
 * 
 * ORM PARAMS
 * 
 */

type OrmParams = {
    productId ?: string,
    priceListId ?: string,
    defaultQuantity ?: number,
    isOptional ?: boolean,
    name ?: string,
    isQuantitySelectable ?: boolean,
    type ?: ComplementType

}

type ItemOrmParams = {
    complementId: string,
    productItemId: string
}

type ItemsOrmParams = {
    complementId : string,
    productItemsId : string[]
}

/**
 * 
 * SAFE UPDATE ORM
 * 
 */

type SafeUpdateOrm = {
    defaultQuantity ?: number,
    isOptional ?: boolean,
    isQuantitySelectable ?: boolean,
    type ?: ComplementType
}

@Injectable()
export default class ComplementQuery {
    constructor(
        @InjectRepository(Complement)
        private readonly repo: Repository<Complement>,

        @InjectRepository(ComplementItem)
        private readonly itemRepo: Repository<ComplementItem>
    ) {

    }

    /**
     * 
     * FIND
     * 
     */

    /**
     * 
     * @param options 
     * @returns 
     */

    async findOne(
        options: FindOneOptions<Complement>
    ) {
        return this.repo.findOne(options);
    }

    /**
     * 
     * @param options 
     * @returns 
     */

    async findOneOrFail(
        options: FindOneOptions<Complement>
    ) {

        const composity = await this.findOne(options);

        if (!composity) {
            throw new BadRequestException("Complement was not found");
        }

        return composity;

    }

    /**
     * 
     * EXISTS
     * 
     */

    exists(
        where : FindOptionsWhere<Complement>
    ){
        return this.repo.exists({where});
    }
    
    /**
     * 
     * COUNT
     * 
     */

    count(
        where : FindOptionsWhere<Complement>
    ){
        return this.repo.count({where});
    }
    
    countItem(
        where : FindOptionsWhere<ComplementItem>
    ){
        return this.itemRepo.count({where});
    }

    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * Guarda el composity en DB
     * 
     * @param orm 
     * @returns 
     */

    async saveOne(
        params: OrmParams
    ): Promise<Complement> {

        const orm = this.makeOrm(params);

        return this.repo.save(orm);

    }

    /**
     * 
     * Guarda los composity items en DB
     * 
     * @param orm 
     * @returns 
     */

    async saveItems(
        params : ItemsOrmParams
    ): Promise<ComplementItem[]> {

        const orm = this.makeItemsOrm(params);

        return this.itemRepo.save(orm);

    }

    /**
     * 
     * Guarda el composity item en DB
     * 
     * @param orm 
     * @returns 
     */

    async saveItem(
        params: ItemOrmParams
    ): Promise<ComplementItem> {

        const orm = this.makeItemOrm(params);

        return this.itemRepo.save(orm);

    }

    /**
     * 
     * UPDATERS
     * 
     */

    /**
     * 
     * @param complementId 
     * @param orm 
     * @returns 
     */

    async updateOne(
        complementId: string,
        orm: SafeUpdateOrm,
        returning: string[] | string = "*"
    ) {

        const { raw, affected } = await this.repo
            .createQueryBuilder()
            .update(Complement)
            .set(orm)
            .where("id = :complementId", {
                complementId
            })
            .returning(returning)
            .execute();

        if (!affected) {
            throw new BadRequestException("Complement was not affected");
        }

        return this.repo.merge(
            new Complement(),
            raw[0]
        )

    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param options 
     * @returns 
     */

    async deleteOne(
        options: FindOptionsWhere<Complement>
    ) {
        return this.repo.delete(options);
    }

    /**
     * 
     * @param options 
     * @returns 
     */

    async deleteOneItem(
        options: FindOptionsWhere<ComplementItem>
    ) {
        return this.itemRepo.delete(options);
    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param complementId 
     * @param priceListId 
     */

    async setPriceList(
        complementId: string,
        priceListId: string
    ) {

        await this.repo
            .createQueryBuilder()
            .relation(Complement, "priceList")
            .of(complementId)
            .set(priceListId);

    }

    /**
     * 
     * ORM
     * 
     */

    /**
     * 
     * Maqueta el composity orm
     * 
     * @param param0 
     * @returns 
     */

    makeOrm(
        params : OrmParams
    ): DeepPartial<Complement> {

        const {
            productId,
            priceListId,
            ...rest
        } = params;

        const orm : DeepPartial<Complement> = {
            ...rest
        }

        if(productId){
            orm.product = {
                id : productId
            }
        }

        if(priceListId){
            orm.priceList = {
                id : priceListId
            }
        }

        return orm

    }

    /**
     * 
     * Maqueta el orm del composity item
     * 
     * @param param0 
     * @returns 
     */

    makeItemOrm({
        complementId,
        productItemId
    }: ItemOrmParams
    ): DeepPartial<ComplementItem> {
        return {
            complement: {
                id: complementId
            },
            item: {
                id: productItemId
            }
        }
    }

    /**
     * 
     * Maqueta el orm de los composity items dados
     * 
     * @param params 
     * @returns 
     */

    makeItemsOrm(
        params: ItemsOrmParams
    ): DeepPartial<ComplementItem>[] {

        const {
            complementId,
            productItemsId
        } = params;

        return productItemsId.map(productItemId => this.makeItemOrm({
            productItemId,
            complementId
        }))

    }

}