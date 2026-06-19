import { ObjectLiteral } from "typeorm";
import {BaseQuery} from "./base-query.crud";
import { QueryDeepPartialEntity } from "typeorm/browser";
import { BadRequestException } from "@nestjs/common";

export abstract class BaseUpdater<
    T extends ObjectLiteral,
    TParams extends object,
    TQuery extends BaseQuery<T>
> {

    constructor(
        readonly query: TQuery
    ) { }

    /**
     * 
     * @param where 
     * @param params 
     * @returns 
     */

    update(
        where : ObjectLiteral,
        params : TParams
    ){
        return this.resolveUpdate(
            where,
            params
        );
    }

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    updateById(
        id : string,
        params : TParams
    ){

        return this.resolveUpdate(
            {
                id
            },
            params
        )

    }

    /**
     * 
     * RESOLVERS
     * 
     */

    /**
         * 
         * @param id 
         * @param params 
         * @param returning 
         * @returns 
         */

    protected async resolveUpdate(
        where: ObjectLiteral,
        params: TParams,
        returning: string[] | string = "*"
    ) {

        const orm = this.query.makeOrm(params) as QueryDeepPartialEntity<T>;

        const { raw, affected } = await this.query.update(
            where,
            orm,
            returning
        )

        if (!affected) {
            throw new BadRequestException("Entity does not exists");
        }

        return raw[0] as T;

    }

}