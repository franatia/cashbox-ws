import { ObjectLiteral } from "typeorm";
import {BaseQuery} from "./base-query.crud";
import { BadRequestException } from "@nestjs/common";

export abstract class BaseSaver<
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

    saveOne(
        params: TParams
    ) {
        return this.resolveSaveOne(
            params
        );
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    saveMany(
        params: TParams[]
    ) {

        return this.resolveSaveMany(
            params
        );

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

    protected async resolveSaveOne(
        params: object
    ) {

        const orm = this.query.makeOrm(params);

        const raw = await this.query.save(orm);

        if (!raw.length) {
            throw new BadRequestException(
                "Entity was not saved"
            );
        }

        return raw[0];

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    protected resolveSaveMany(
        params: object[]
    ) {

        const orm = this.query.makeManyOrm(
            params
        );

        return this.query.save(...orm);

    }

}