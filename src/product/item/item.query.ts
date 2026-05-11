import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "../entities/item.entity";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { DataSource } from "typeorm";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { buildSku, SkuPrefix } from "@/common/helpers/sku.helper";
import { FeatureDto } from "../features/dto/feature.dto";
import { SelectQueryBuilder } from "typeorm";
import { FeaturesService } from "../features/features.service";
import { CombinationSeed } from "../features/interfaces/combination-seed.interface";
import { FeatureContext } from "./interfaces/feature-context";


/**
 * 
 * ORM PARAMS
 * 
 */

type OrmParams = {
    productId?: string,
    featureGroupId?: string,
    featureValuesId?: string[],
    projectId?: string,
    groupId?: string,
    name?: string,
    sku?: string,
    webVisibility?: boolean;
}

/**
 * 
 * UPDATE PARAMS
 * 
 * 
 */

type SafeUpdateOrm = {
    name?: string,
    sku?: string,
    webVisibility?: boolean,
}

@Injectable()
export default class ItemQuery {
    constructor(
        @InjectRepository(Item)
        private readonly repo: Repository<Item>,

        private readonly dataSource: DataSource,

        @Inject(forwardRef(() => FeaturesService))
        private readonly featuresService: FeaturesService
    ) { }

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
        options: FindOneOptions<Item>
    ) {
        return this.repo.findOne(options);
    }

    /**
     * 
     * Busca los productItems segun
     * el options where dado
     * 
     * @param where 
     * @param select 
     * @returns 
     */

    async findMany(
        options: FindManyOptions<Item>
    ): Promise<Item[]> {

        return this.repo.find(options);

    }

    /**
     * Busca los items del product
     * segun los feature values id
     * dados
     * 
     * @param featureValuesId 
     * @returns 
     */

    async findByFeatureValues(
        featureValuesId: string[]
    ): Promise<Item[]> {

        const subQuery = this.filterByFeatureValuesSubQuery(
            featureValuesId
        )

        return this.repo
            .createQueryBuilder("item")
            .where(`item.id IN (${subQuery.getQuery()})`)
            .setParameters(subQuery.getParameters())
            .getMany();

    }

    /**
     * 
     * Busca los items del product
     * segun los feature values id
     * dados, y retorna los id de los
     * items.
     * 
     * @param featureValuesId 
     * @returns 
     */

    async findIdsByFeatureValues(
        featureValuesId: string[]
    ): Promise<string[]> {

        const productItems = await this.findByFeatureValues(
            featureValuesId
        );

        return productItems.map(item => item.id);

    }

    /**
     * 
     * Busca product items segun un feature
     * context (que coincida con el featureGroupId
     * y featureValuesId dados)
     * 
     * @param featureGroupId 
     * @param featureValuesId 
     * @returns 
     */

    async findByFeatureContext(
        context: FeatureContext,
        strictFeatureValues: boolean = false
    ): Promise<Item[]> {

        const qb = this.buildFeatureContextQuery(context, strictFeatureValues);

        return qb.getMany();
    }

    /**
     * 
     * EXISTS
     * 
     */

    exists(
        where: FindOptionsWhere<Item>
    ) {
        return this.repo.exists({
            where
        })
    }

    /**
     * 
     * @param context 
     * @param strictFeatureValues 
     * @returns 
     */

    async existsByFeatureContext(
        context: FeatureContext,
        strictFeatureValues: boolean = false
    ): Promise<boolean> {

        const qb = this.buildFeatureContextQuery(context, strictFeatureValues);

        return qb.getExists();

    }

    /**
     * 
     * COUNT
     * 
     */

    count(
        where: FindOptionsWhere<Item>
    ) {
        return this.repo.count({
            where
        })
    }

    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * Prepara los datos para la creacion
     * de los productItems y luego los guarda
     * 
     * @param product 
     * @param features 
     * @param featureGroupId 
     * @returns 
     */

    async prepareAndSaveByFeatureContext(
        productId: string,
        features: FeatureDto[],
        featureGroupId?: string
    ): Promise<string[]> {

        // Combinamos por producto cartesiano los feature value

        const combinations = await this.featuresService.buildCombinations(
            features
        )

        const orm = await this.prepareByFeatureContext(
            productId,
            combinations,
            featureGroupId
        )

        return this.saveMany(
            orm
        )

    }

    /**
     * 
     * Guarda los product items dados
     * 
     * @param payload 
     * @returns 
     */

    async saveMany(

        params: OrmParams[]

    ): Promise<string[]> {

        const orm = this.makeManyOrm(params);

        return this.dataSource.transaction(async manager => {

            const items = await manager.save(
                Item,
                orm,
                {

                }
            );

            return items.map(item => item.id);

        })

    }

    /**
     * 
     * @param orm 
     * @returns
     */

    async saveOne(
        params: OrmParams
    ): Promise<Item> {

        const orm = this.makeOrm(params);

        const productItemDraft = this.repo.create(orm)

        const productItem = await this.repo.save(productItemDraft);

        return productItem;

    }

    /**
     * 
     * UPDATERS
     * 
     */

    /**
     * 
     * Edita el productItem
     * 
     * @param productItemId 
     * @param orm 
     * @param returning 
     * @returns 
     */

    async updateOne(
        itemId: string,
        orm: SafeUpdateOrm,
        returning: string[] | string = "*"
    ): Promise<Item> {

        const { raw, affected } = await this.repo
            .createQueryBuilder()
            .update(Item)
            .set(orm)
            .where("id = :itemId", { itemId })
            .returning(returning)
            .execute()

        if (!affected) {
            throw new BadRequestException("Product Item was not affected");
        }

        const entity = this.repo.merge(
            new Item(),
            raw[0]
        )

        return entity;

    }

    /**
     * 
     * Edita todos los product items dados,
     * IMPORTANTE! Se toman los id del DeepPartial
     * para buscar
     * 
     * @param orm 
     * @returns 
     */

    private async updateMany(
        orm: DeepPartial<Item>[]
    ): Promise<Item[]> {

        const productItems = await Promise.all(
            orm.map(entity => {
                const { id, ...rest } = entity;

                if (!id) {
                    throw new BadRequestException("Product item id was not provided");
                }

                return this.updateOne(
                    id,
                    rest
                )
            })
        )

        return productItems;

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
        options: FindOptionsWhere<Item>
    ) {
        return this.repo.delete(options);
    }

    /**
     * 
     * @param featureValueId 
     * @returns 
     */

    async deleteByFeatureValue(
        featureValueId: string
    ) {

        const subQuery = this.repo
            .createQueryBuilder("item")
            .innerJoin(
                "item.featureValues",
                "fv"
            )
            .where("fv.id = :featureValueId", { featureValueId })
            .select("item.id");

        await this.repo.manager
            .createQueryBuilder()
            .delete()
            .from("product.item_groups_product_items")
            .where(`product_item_id IN (${subQuery.getQuery()})`)
            .setParameters(subQuery.getParameters())
            .execute();

        const result = await this.repo
            .createQueryBuilder()
            .delete()
            .where(`id IN (${subQuery.getQuery()})`)
            .setParameters(subQuery.getParameters())
            .returning(["id"])
            .execute();

        return result.raw.map(row => String(row.id));
    }

    /**
     * 
     * SUBQUERIES
     * 
     */

    /**
     * 
     * Crea un subquery que busca los
     * product items que contienen
     * todos los feature values dados
     * 
     * 1. Selecciona solo los id
     * 
     * @param featureValuesId 
     * @returns 
     */

    filterByFeatureValuesSubQuery(
        featureValuesId: string[]
    ): SelectQueryBuilder<Item> {

        const subquery = this.repo
            .createQueryBuilder("item")
            .innerJoin("item.featureValues", "fv")
            .andWhere("fv.id IN (:...valuesId)", { valuesId: featureValuesId })
            .groupBy("item.id")
            .having("COUNT(DISTINCT fv.id) = :count", {
                count: featureValuesId.length
            })
            .select("item.id");

        return subquery

    }

    /**
     * 
     * HELPERS
     * 
     */

    private buildFeatureContextQuery(
        context: FeatureContext,
        strictFeatureValues: boolean = false
    ) {
        const { featureGroupId, featureId, featureValuesId } = context;

        if (!featureGroupId && !featureId && !featureValuesId?.length) {
            throw new BadRequestException("Product item feature context is empty");
        }

        const qb = this.repo
            .createQueryBuilder("item");

        const needsJoin = !strictFeatureValues && (featureId || featureValuesId?.length);

        if (needsJoin) {
            qb.innerJoinAndSelect("item.featureValues", "fv");
        }

        if (featureGroupId) {
            qb.andWhere("item.featureGroupId = :featureGroupId", {
                featureGroupId
            });
        }

        if (featureId) {
            qb.andWhere("fv.featureId = :featureId", {
                featureId
            });
        }

        if (!strictFeatureValues && featureValuesId?.length) {
            qb.andWhere("fv.id IN (:...featureValuesId)", {
                featureValuesId
            });
        }

        if (strictFeatureValues && featureValuesId?.length) {
            const subquery = this.filterByFeatureValuesSubQuery(featureValuesId);

            qb.andWhere(`item.id IN (${subquery.getQuery()})`);

            qb.setParameters({
                ...qb.getParameters(),
                ...subquery.getParameters()
            });
        }

        if (needsJoin) {
            qb.distinct(true);
        }

        return qb;
    }

    private async prepareByFeatureContext(
        productId: string,
        combinations: CombinationSeed[][],
        featureGroupId?: string,
    ) {
        const orm: DeepPartial<Item>[] = [];

        for (const combination of combinations) {

            const featureValuesId = this.featuresService.getValuesIdByCombination(combination);

            const isExists = await this.existsByFeatureContext({
                featureGroupId,
                featureValuesId
            }, true)

            if (isExists) {
                continue;
            };

            const sku = buildSku(SkuPrefix.PRODUCT_ITEM);

            orm.push(
                this.makeOrm({
                    productId,
                    sku,
                    featureGroupId,
                    featureValuesId
                })
            )
        }

        return orm;
    }

    /**
     * 
     * ORM
     * 
     */

    /**
     * 
     * crea la estructura orm para
     * inyectar en la DB
     * 
     * @param productId 
     * @param sku 
     * @param featureGroupId 
     * @param featureValuesId 
     * @param name 
     * @returns 
     */

    makeOrm({
        productId,
        featureGroupId,
        featureValuesId,
        projectId,
        groupId,
        ...rest
    }: OrmParams): DeepPartial<Item> {

        const orm: DeepPartial<Item> = {
            ...rest
        };

        if (productId || projectId) {
            orm.product = {
                ...(productId && ({
                    id: productId
                })),
                ...(projectId && ({
                    project: {
                        id: projectId
                    }
                }))
            };
        }

        if (featureGroupId) {
            orm.featureGroup = {
                id: featureGroupId
            };
        }

        if (featureValuesId?.length) {
            orm.featureValues = featureValuesId.map(id => ({ id }));
        }

        if (groupId) {
            orm.groups = [{
                id: groupId
            }]
        }

        return orm;
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    makeManyOrm(
        params: OrmParams[]
    ) {
        return params.map(param => this.makeOrm(param));
    }

}