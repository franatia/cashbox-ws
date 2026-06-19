import { BadRequestException } from "@nestjs/common";
import { FindOptionsWhere, ObjectLiteral } from "typeorm";
import { BaseFinder } from "./query/base-finder.crud";
import {BaseQuery} from "./query/base-query.crud";

export abstract class BaseRelations<
    T extends ObjectLiteral,
    TQuery extends BaseQuery<T>,
    TFinder extends BaseFinder<T, TQuery>
> {

    constructor(
        protected readonly finder: TFinder
    ) { }

    protected async linkedTo(
        value: FindOptionsWhere<T> | (() => Promise<boolean>),
        errMsg: string,
        throwable: boolean = true
    ) {

        const exists = typeof value === "function"
            ? await value()
            : await this.finder.exists(value);

        if (!exists && throwable) {

            throw new BadRequestException(
                errMsg
            )

        };

        return exists;

    }

    protected async manyLinkedTo(
        value: FindOptionsWhere<T> | (() => Promise<number>),
        count: number,
        errMsg: string,
        throwable: boolean = true
    ) {

        const countResult = typeof value === "function"
            ? await value()
            : await this.finder.count(value);

        const exists = countResult === count;

        if (!exists && throwable) {

            throw new BadRequestException(
                errMsg
            );

        }

        return exists;

    }

}