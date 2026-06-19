import { ObjectLiteral } from "typeorm";
import {BaseQuery} from "./base-query.crud";
import { BadRequestException } from "@nestjs/common";

export abstract class BaseDeleter<
    T extends ObjectLiteral,
    TParams extends object,
    TQuery extends BaseQuery<T>
> {

    constructor(
        readonly query: TQuery
    ) { }

    /**
     * 
     * @param params 
     * @returns 
     */

    delete(
        params: TParams
    ) {
        return this.resolveDelete(params);
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    deleteById(
        id: string
    ) {

        const where = {
            id
        } as unknown as TParams;

        return this.resolveDelete(where);

    }

    /**
     * 
     * RESOLVERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    protected async resolveDelete(
        params: TParams
    ) {

        const orm = this.query.makeOrm(params);

        const { raw, affected } = await this.query.delete(orm);

        if (!affected) {
            throw new BadRequestException("Entity does not exists");
        }

        return raw[0] as T;

    }

}