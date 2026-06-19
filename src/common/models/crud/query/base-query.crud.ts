import { notObjectEmpty } from "@/common/helpers/object.helper";
import { BadRequestException } from "@nestjs/common";
import { DeepPartial, EntityTarget, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, QueryDeepPartialEntity, Repository } from "typeorm";

export abstract class BaseQuery<T extends ObjectLiteral> {

    constructor(
        private readonly entity: EntityTarget<T>,
        readonly repo: Repository<T>
    ) { }

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

    count(
        where: FindOptionsWhere<T>
    ) {
        return this.repo.count({
            where
        })
    }

    exists(
        where: FindOptionsWhere<T>
    ) {
        return this.repo.exists({
            where
        })
    }

    /**
     * 
     * SAVERS
     * 
     * 
     */

    /**
     * 
     * @param orm 
     * @returns 
     */

    save(
        ...orm: DeepPartial<T>[]
    ) {

        const entities = this.repo.create(orm);

        return this.repo.save(
            entities
        );
    }

    /**
     * 
     * UPDATE
     * 
     */

    update(
        where: ObjectLiteral,
        orm: QueryDeepPartialEntity<T>,
        returning: string[] | string = ""
    ) {

        return this.repo
            .createQueryBuilder()
            .update(this.entity)
            .set(orm)
            .where(where)
            .returning(returning)
            .execute();

    }

    /**
     * 
     * DELETERS
     * 
     */

    /**
     * 
     * @param id 
     * @returns 
     */

    delete(
        where: ObjectLiteral,
        returning: string | string[] = "*"
    ) {

        return this.createQueryBuilder()
            .delete()
            .from(this.entity)
            .where(where)
            .returning(returning)
            .execute();

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param params 
     */

    notEmptyParams(
        params: object
    ) {
        notObjectEmpty(params);
    }

    /**
     * 
     * @param params 
     */

    abstract makeOrm(params: any): DeepPartial<T>

    /**
     * 
     * @param params 
     * @returns 
     */

    makeManyOrm(params: any[]): DeepPartial<T>[] {

        return params.map(param => (
            this.makeOrm(param)
        ));

    }

    /**
     * 
     * @param alias 
     * @returns 
     */

    createQueryBuilder(
        alias?: string
    ) {

        return this.repo.createQueryBuilder(alias);
    }

    protected async resolveSaveOne(
        params: object
    ) {

        const orm = this.makeOrm(params);

        const raw = await this.save(orm);

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

        const orm = this.makeManyOrm(
            params
        );

        return this.save(...orm);

    }

    protected async resolveUpdate(
        where: ObjectLiteral,
        params: object,
        returning: string[] | string = "*"
    ) {

        const orm = this.makeOrm(params) as QueryDeepPartialEntity<T>;

        const { raw, affected } = await this.update(
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