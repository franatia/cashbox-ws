import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Feature } from "../entities/feature.entity";
import { DataSource, DeepPartial, EntityManager, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import CreateFeatureDto from "./dto/create-feature.dto";
import { FeatureWithContext } from "./interfaces/feature-with-context.interface";
import { FeatureValue } from "../entities/feature-value.entity";
import { FeatureValuesService } from "../feature-values/feature-values.service";
import { FeatureGroupService } from "../feature-group/feature-group.service";
import FeatureValuesQuery, { PrepareToSaveParams as PrepareFeatureValuesParams } from "../feature-values/feature-values.query";
import FeatureGroupQuery from "../feature-group/feature-group.query";

type OrmParams = {
    name: string,
    productId: string
}

/**
 * 
 * SAFE UPDATE ORM
 * 
 */

type SafeUpdateOrm = {
    name?: string
}

@Injectable()
export default class FeaturesQuery {

    constructor(

        @InjectRepository(Feature)
        private readonly repo: Repository<Feature>,

        private readonly dataSource: DataSource,

        @Inject(forwardRef(() => FeatureValuesService))
        private readonly valuesService: FeatureValuesService,
        private readonly groupService: FeatureGroupService,

        private readonly valuesQuery: FeatureValuesQuery,
        private readonly groupQuery: FeatureGroupQuery
    ) { }

    /**
     * 
     * EXISTS
     * 
     */

    exists(
        where: FindOptionsWhere<Feature>
    ) {
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
        where: FindOptionsWhere<Feature>
    ) {
        return this.repo.count({
            where
        })
    }

    /**
     * 
     * QUERY
     * 
     */

    async findOne(
        options: FindOneOptions<Feature>
    ) {
        return this.repo.findOne(options);
    }

    async findOneOrError(
        options: FindOneOptions<Feature>
    ): Promise<Feature> {
        const feature = await this.repo.findOne(options);

        if (!feature) {
            throw new BadRequestException("Product feature was not found");
        }

        return feature
    }

    /**
     * 
     * Prepara los datos necesarios
     * para guardar la entidad en DB,
     * y las guarda.
     * 
     * @param productId 
     * @param features 
     * @returns 
     */

    async prepareAndSaveMany(
        productId: string,
        features: CreateFeatureDto[]
    ): Promise<FeatureWithContext[]> {

        return this.dataSource.transaction(async manager => {

            /**
             * 
             * Preparamos y guardamos
             * product features
             * 
             */

            const productFeaturesOrm = this.prepareAndMakeOrm(
                productId,
                features
            )

            const productFeatures = await this.saveFeatures(
                manager,
                productFeaturesOrm
            )

            const featuresWithContext = this.buildFeatureWithContext(
                productFeatures,
                features
            )

            /**
             * 
             * Preparamos y guardamos
             * los feature values
             * 
             */

            const featureValues = await this.prepareAndSaveValues(
                featuresWithContext,
                manager
            )

            /**
             * 
             * Construimos 
             * el retorno de datos
             * 
             */

            return this.buildSaveManyReturn(
                featuresWithContext,
                featureValues
            )

        })

    }

    /**
     * 
     * @param features 
     * @param manager 
     * @returns 
     */

    async prepareAndSaveValues(
        features: FeatureWithContext[],
        manager: EntityManager
    ) {
        const featureValuesParams: PrepareFeatureValuesParams[] = features.map(({ productFeature, dto }, index) => {
            return {
                featureId: productFeature.id,
                values: dto.values
            }
        });

        return this.valuesQuery
            .prepareAndSave(
                featureValuesParams,
                manager
            )
    }

    /**
     * 
     * @param featureId 
     * @param valuesId 
     * @param manager 
     */

    async setValues(
        featureId: string,
        valuesId: string[],
        manager: EntityManager | Repository<Feature> = this.repo
    ) {

        await manager.createQueryBuilder()
            .relation(Feature, "values")
            .of(featureId)
            .set(valuesId);

    }


    /**
     * 
     * Agrega los feature values a la entidad.
     * Realiza las siguientes operaciones:
     * 
     * 1. Busca los feature groups relacionados
     * 2. Crea los nuevos product items relacionados
     * a los feature groups.
     * 3. Crea o actualiza product item groups:
     *  a) En caso de ser main feature va a crear un
     *     grupo nuevo.
     *  b) En caso de no ser main feature, se actualizan
     *     los item groups relacionados a los feature groups
     *     agregando los product items creados para cada uno
     * 
     * @param featureId 
     * @param valuesId 
     * @param manager 
     * @returns 
     */

    async addValues(
        featureId: string,
        valuesId: string[],
        manager: EntityManager | Repository<Feature> = this.repo
    ) {

        await manager.createQueryBuilder()
            .relation(Feature, "values")
            .of(featureId)
            .add(valuesId);

    }

    /**
     * 
     * @param featureId 
     * @param valuesId 
     * @param manager 
     */

    async removeValues(
        featureId: string,
        valuesId: string[],
        manager: EntityManager | Repository<Feature> = this.repo
    ) {


        await manager.createQueryBuilder()
            .relation(Feature, "values")
            .of(featureId)
            .remove(valuesId);

    }

    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * Guarda los features en DB,
     * usando un entity manager
     * 
     * @param manager 
     * @param orm 
     * @returns 
     */

    async saveFeatures(
        manager: EntityManager,
        orm: DeepPartial<Feature>[]
    ): Promise<Feature[]> {

        return manager.save(
            Feature,
            orm
        );

    }

    /**
     * 
     * Guarda el feature en DB,
     * usando un entity manager
     * 
     * @param manager 
     * @param orm 
     * @returns 
     */

    async saveFeature(
        manager: EntityManager,
        orm: DeepPartial<Feature>
    ): Promise<Feature> {
        return manager.save(
            Feature,
            orm
        )
    }

    /**
     * 
     * Guarda el feature value en DB,
     * usando un entity manager
     * 
     * @param manager 
     * @param orm 
     * @returns 
     */

    async saveFeatureValue(
        manager: EntityManager,
        orm: DeepPartial<FeatureValue>
    ): Promise<(DeepPartial<FeatureValue> & FeatureValue)> {
        return manager.save(
            FeatureValue,
            orm
        )
    }

    /**
     * 
     * UPDATERS
     * 
     */

    async updateOne(
        featureId: string,
        orm: SafeUpdateOrm
    ): Promise<Feature> {

        const { raw, affected } = await this.repo
            .createQueryBuilder()
            .update(Feature)
            .set(orm)
            .where("id = :featureId", { featureId })
            .returning("*")
            .execute();

        if (!affected) {
            throw new BadRequestException("Product feature was not affected");
        }

        const newFeature = this.repo.merge(
            new Feature(),
            raw[0]
        )

        return newFeature;

    }

    async updateRelatedFeatureContexts(
        featureId: string
    ) {
        const groups = await this.groupQuery.findMany({
            where: {
                items: {
                    feature: {
                        id: featureId
                    }
                }
            },
            select: {
                id: true
            }
        })

        const { product } = await this.findOneOrError({
            where: {
                id: featureId
            },
            select: {
                product: true
            },
            loadRelationIds: {
                relations: ["product"]
            }
        });
        const productId = String(product);

        return Promise.all(groups.map(({ id: groupId }) => (
            this.groupService.createOrUpdateFeatureContext({
                groupId,
                productId
            })
        )))

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

    async deleteById(
        id: string
    ) {

        const payload = await this.groupService.handleFeatureDelete(
            id
        )

        await this.repo.createQueryBuilder()
            .delete()
            .where({ id })
            .execute();

        return {
            deletedFeature: id,
            ...payload
        }

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
         * 
         * Crea un tipo que junta los DTO
         * con sus entities, ayuda al create many
         * despues a armar el DTO para crear el
         * feature context
         * 
         * @param featuresEntities 
         * @param featuresDto 
         * @returns 
         */

    buildFeatureWithContext(
        featuresEntities: Feature[],
        featuresDto: CreateFeatureDto[]
    ): FeatureWithContext[] {
        return featuresEntities.map((feature, i) => ({
            productFeature: feature,
            dto: featuresDto[i]
        }));
    }

    /**
         * 
         * Prepara los datos para retornar
         * en prepareAndSaveMany
         * 
         * @param features 
         * @param featureValues 
         * @returns 
         */

    buildSaveManyReturn(
        features: FeatureWithContext[],
        featureValues: FeatureValue[]
    ) {
        const featureValuesByFeatureId = this.valuesService
            .mapByFeatureId(
                featureValues
            )

        return features.map(context => {

            const { productFeature, dto } = context;

            const values = featureValuesByFeatureId.get(
                productFeature.id
            ) ?? [];

            return {
                productFeature: {
                    ...productFeature,
                    values
                },
                dto
            }
        })
    }

    /**
     * 
     * ORM
     * 
     */

    /**
     * 
     * Crea el ORM del product feature
     * para inyectarlo en DB
     * 
     * @param param0 
     * @returns 
     */

    private makeOrm(
        params: Partial<OrmParams>
    ): DeepPartial<Feature> {

        const {
            productId,
            ...rest
        } = params;

        const orm: DeepPartial<Feature> = {
            ...rest
        };

        if (productId) {
            orm.product = {
                id: productId
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

        return params.map(param => this.makeOrm(param))

    }

    /**
     * 
     * Arma los ORM params y 
     * crea los ORM
     * 
     * @param productId 
     * @param features 
     * @returns 
     */

    private prepareAndMakeOrm(
        productId: string,
        features: CreateFeatureDto[]
    ) {
        const productFeaturesParams: OrmParams[] = features.map(feature => ({
            ...feature,
            productId
        }));

        return this.makeManyOrm(
            productFeaturesParams
        );
    }

}