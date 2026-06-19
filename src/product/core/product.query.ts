import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product, ProductSubtractType, ProductUnit } from "../entities/product.entity";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { ItemService } from "../item/item.service";

/**
 * 
 * ORM PARAMS
 * 
 */

type OrmParams = {
  projectId?: string;
  name?: string;
  slug?: string;
  subtractType?: ProductSubtractType;
  unit?: ProductUnit;
  visibility?: boolean;
  brandId?: string;
  basePrice?: number;
  description?: string;
}

/**
 * 
 * SAFE UPDATE ORM
 * 
 */

type SafeUpdateOrm = {
  name?: string;
  description?: string;
  slug?: string;
  basePrice?: number;
  visibility?: boolean;
  subtractType?: ProductSubtractType;
  unit?: ProductUnit;
  costId ?: string;
}

@Injectable()
export default class ProductQuery extends BaseQuery<Product> {
    constructor(
        @InjectRepository(Product)
        repo: Repository<Product>,

        private readonly itemService : ItemService
    ) {
        super(Product, repo);
    }

  /**
   * 
   * FIND
   * 
   */

    /**
     * 
     * 
     * 
     * @param where 
     * @param select 
     * @returns 
     */

    async findOne(
        options: FindOneOptions<Product>
    ): Promise<Product | null> {
        return this.repo.findOne(options)
    }

    /**
     * 
     * 
     * 
     * @param where 
     * @param select 
     * @returns 
     */

    async findOneOrFail(
        options: FindOneOptions<Product>
    ): Promise<Product> {
        const product = await this.findOne(
            options
        )

        if (!product) throw new BadRequestException("Product does not exists");

        return product;
    }

    /**
     * 
     * EXISTS
     * 
     */

    exists(
        where : FindOptionsWhere<Product>
    ){
        return this.repo.exists({
            where
        });
    }

    /**
     * 
     * COUNT
     * 
     */

    count(
        where : FindOptionsWhere<Product>
    ){
        return this.repo.count({
            where
        });
    }

    /**
     * 
     * SAVERS
     * 
     */

    saveOne(
        params : OrmParams 
    ): Promise<Product> {

        const orm = this.makeOrm(params);

        return this.repo.save(orm);
    }

    /**
     * 
     * UPDATERS
     * 
     */

    /**
     * 
     * @param productId 
     * @param orm 
     * @param returning 
     * @returns 
     */

    async updateOne(
        productId: string,
        orm: SafeUpdateOrm
    ): Promise<Product> {

        const {
            costId,
            ...rest
        } = orm;

        const raw = await this.resolveUpdate(
            {productId},
            rest
        );

        if(costId){
            await this.itemService.putManyByProduct(
                productId,
                {
                    costId
                }
            )
        }

        const entity = this.repo.merge(
            new Product(),
            raw[0]
        );

        return entity;

    }

    /**
     * 
     * DELETE
     * 
     */

    async deleteOne(
        where : FindOptionsWhere<Product>
    ) {
        return this.repo.delete(where)
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
        params: OrmParams
    ): DeepPartial<Product> {

        const {
            projectId,
            brandId,
            ...rest
        } = params

        const orm: DeepPartial<Product> = {
            ...rest
        }

        if (projectId) {
            orm.project = {
                id: projectId
            }
        }

        if (brandId) {
            orm.brand = {
                id: brandId
            }
        }

        return orm;

    }

}