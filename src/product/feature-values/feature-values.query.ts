import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FeatureValue } from "../entities/feature-value.entity";
import { DeepPartial, EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { FeatureGroupService } from "../feature-group/feature-group.service";


/**
 * 
 * ORM PARAMS
 * 
 */

type OrmParams = {
    value?: string;
    featureId?: string;

}

/**
 * 
 * SAFE UPDATE PARAMS
 * 
 */

type SafeUpdateOrm = {
    value?: string
}

/**
 * 
 * 
 * 
 */

export type PrepareToSaveParams = {
    featureId: string,
    values: string[],
    schemaItemId?: string
}

@Injectable()
export default class FeatureValuesQuery {
    constructor(
        @InjectRepository(FeatureValue)
        private readonly repo: Repository<FeatureValue>,

        private readonly groupService : FeatureGroupService
    ) { }

    /**
     * 
     * COUNT
     * 
     */

    count(
        where: FindOptionsWhere<FeatureValue>
    ) {
        return this.repo.count({
            where
        })
    }

    /**
     * 
     * EXISTS
     * 
     */

    exists(
        where: FindOptionsWhere<FeatureValue>
    ) {
        return this.repo.exists({
            where
        })
    }

    /**
         * 
         * QUERY
         * 
         */

    /**
     * 
     * @param options 
     * @returns 
     */

    async findOne(
        options: FindOneOptions<FeatureValue>
    ) {
        return this.repo.findOne(options);
    }

    /**
     * 
     * @param options 
     * @returns 
     */

    async findOneOrFail(
        options: FindOneOptions<FeatureValue>
    ): Promise<FeatureValue> {
        const value = await this.findOne(options);
        if (!value) {
            throw new BadRequestException("Feature value was not found");
        }
        return value;
    }

    /**
     * 
     * @param where 
     * @param select 
     * @returns 
     */

    async findMany(
        options: FindManyOptions<FeatureValue>
    ): Promise<FeatureValue[]> {

        const featureValues = await this.repo.find(options);

        return featureValues

    }

    /**
 * 
 * SAVERS
 * 
 */

    /**
     * 
     * @param orm 
     * @returns 
     */

    async saveOne(
        params : OrmParams
    ): Promise<FeatureValue> {

        const orm = this.makeOrm(params);
        return this.repo.save(orm);

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    async saveMany(
        params: OrmParams[]
    ): Promise<FeatureValue[]> {

        const orm = this.makeManyOrm(params);

        return this.repo.save(orm);
    }

    /**
     * 
     * Guarda los feature values en DB,
     * usando un entity manager
     * 
     * @param manager 
     * @param orm 
     * @returns 
     */

    async saveManyWithManager(
        manager: EntityManager,
        params : OrmParams[]
    ) {
        
        const orm = this.makeManyOrm(params);
        
        return manager.save(
            FeatureValue,
            orm
        )
    }

    /**
         * 
         * Prepara y guarda los feature values
         * 
         * @param featureValuesParams 
         * @param manager 
         * @returns 
         */

    prepareAndSave(
        params: PrepareToSaveParams[],
        manager?: EntityManager
    ) {

        const ormParams = this.prepareToSave(params)

        if (manager) {
            return this.saveManyWithManager(
                manager,
                ormParams
            )
        }

        return this.saveMany(
            ormParams
        )

    }

    prepareToSave(
        featureValuesParams: PrepareToSaveParams[],
    ) : OrmParams[] {
        return featureValuesParams.flatMap(({featureId, values}) => (
            values.map(value => ({featureId, value}))
        ))
    }

    /**
     * 
     * UPDATERS
     * 
     */

    async update(
        featureValueId: string,
        orm: SafeUpdateOrm,
        returning: string[] | string = "*"
    ) {

        const { raw, affected } = await this.repo
            .createQueryBuilder()
            .update(FeatureValue)
            .set(orm)
            .where("id = :featureValueId", { featureValueId })
            .returning(returning)
            .execute();

        if (!affected) {
            throw new BadRequestException("Feature value was not affected");
        }

        const entity = this.repo.merge(
            new FeatureValue(),
            raw[0]
        )

        return entity;

    }

    /**
     * 
     * DELETE
     * 
     */

    async deleteById(
        id: string
    ) {

        const payload = await this.groupService.handleFeatureValueDelete(
            id
        );

        await this.repo
            .createQueryBuilder()
            .delete()
            .where({ id })
            .execute();

        return {
            deleteFeatureValue: id,
            ...payload
        }

    }

    /**
     * 
     * ORM
     * 
     */

    /**
     * 
     * @param param0 
     * @returns 
     */

    private makeOrm(
        {
            value,
            featureId
        }: OrmParams
    ): DeepPartial<FeatureValue> {

        const orm: DeepPartial<FeatureValue> = {
            value
        };

        if (featureId) {
            orm.feature = {
                id: featureId
            }
        }

        return orm;

    }

    /**
         * 
         * @param param0 
         * @returns 
         */

    private makeManyOrm(
        params: OrmParams[]
    ): DeepPartial<FeatureValue>[] {

        return params.map(({ featureId, value }) => this.makeOrm({
            featureId,
            value
        }))

    }

}