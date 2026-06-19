import { FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";
import {BaseQuery} from "./base-query.crud";
import { BadRequestException } from "@nestjs/common";

export abstract class BaseFinder<
    T extends ObjectLiteral,
    TQuery extends BaseQuery<T>
> {

    private readonly repo: Repository<T>;

    constructor(
        readonly query: TQuery
    ) {
        this.repo = this.query.repo;
    }

    /**
         * 
         * @param options 
         * @returns 
         */

    findOne(
        options: FindOneOptions<T>
    ) {
        return this.repo.findOne(options);
    }

    /**
     * 
     * @param options 
     * @returns 
     */

    async findOneOrFail(
        options: FindOneOptions<T>
    ): Promise<T> {
        const entity = await this.findOne(options);

        if (!entity) {
            throw new BadRequestException("Entity was not found");
        }

        return entity;
    }

    /**
     * 
     * @param options 
     * @returns 
     */

    findMany(
        options: FindManyOptions<T>
    ) {
        return this.repo.find(options);
    }

    /**
     * 
     * OTHERS
     * 
     */

    /**
         * 
         * @param where 
         * @returns 
         */

    exists(
        where: FindOptionsWhere<T>
    ) {
        return this.repo.exists({ where });
    }

    /**
     * 
     * @param where 
     * @returns 
     */

    count(
        where: FindOptionsWhere<T>
    ) {
        return this.repo.count({
            where
        })
    }

}