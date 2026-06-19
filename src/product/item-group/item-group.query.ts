import { InjectRepository } from "@nestjs/typeorm";
import { ItemGroup, ItemGroupType } from "../entities/item-group.entity";
import { DataSource, DeepPartial, EntityManager, Repository } from "typeorm";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { ItemService } from "../item/item.service";
import { isEmptyObject } from "@/common/helpers/object.helper";

/**
 * 
 * ORM PARAMS
 * 
 */

type OrmParams = {

    name?: string,
    webVisibility?: boolean,
    basePrice?: number,
    baseCost?: number,
    featureGroupId?: string,
    productId?: string,
    type?: ItemGroupType,
    productItemsId?: string[],
    featureValuesId?: string[],

}

type UpdateOrmParams = {

    groupId: string,
    itemsId: string[]

}

type UpdateItemsParams = {
    baseCost?: number;
    basePrice?: number;
    costId?: string;
}

/**
 * 
 * SAFE UPDATE PARAMS
 * 
 */

type SafeUpdateOrm = {
    name?: string,
    basePrice?: number,
    baseCost?: number,
    webVisibility?: boolean,
    costId?: string
}

@Injectable()
export default class ItemGroupQuery extends BaseQuery<ItemGroup> {

    constructor(

        @InjectRepository(ItemGroup)
        repo: Repository<ItemGroup>,

        private readonly dataSource: DataSource,

        @Inject(forwardRef(() => ItemService))
        private readonly itemService: ItemService

    ) {
        super(ItemGroup, repo)
    }

    /**
     * 
     * @param featureGroupId 
     * @param featureValuesId 
     * @returns 
     */

    async findByFeatureContext(
        featureGroupId: string,
        featureValuesId: string[],
        strictFeatureValues: boolean = false,
    ) {

        const qb = this.repo.createQueryBuilder("group")
            .leftJoin("group.items", "productItem")
            .innerJoinAndSelect("group.featureValues", "fv")
            .where("group.featureGroupId = :featureGroupId", {
                featureGroupId
            });

        if (strictFeatureValues) {
            const subQuery = this.filterByFeatureValuesSubQuery(featureValuesId);

            qb.andWhere(`group.id IN (${subQuery.getQuery()})`)
                .setParameters(subQuery.getParameters())
        } else {
            qb.andWhere("fv.id IN (:...featureValuesId)", {
                featureValuesId
            })
        }

        return qb
            .addSelect([
                "productItem.id"
            ]).getMany();
    }

    /**
     * 
     * TRANSACTIONS
     * 
     */

    /**
         * 
         * @param toUpdate 
         * @param toCreate 
         * @returns 
         */

    async runContextTransaction(
        toUpdate: UpdateOrmParams[],
        toCreate: OrmParams[]
    ): Promise<{
        addedItemGroupsId: string[],
        updatedItemGroupsId: string[]
    }> {

        const addedItemGroups = await this.dataSource.transaction(async manager => {

            if (toUpdate.length) {
                await Promise.all(
                    toUpdate.map(({ groupId, itemsId }) => {
                        this.addProductItems(
                            groupId,
                            itemsId,
                            manager
                        )
                    })
                );
            }

            if (toCreate.length) {

                const orm = this.makeManyOrm(
                    toCreate
                )

                const itemGroups = await this.saveManyWithManager(
                    manager,
                    orm
                )

                return itemGroups.map(ig => ig.id);
            }

        })

        return {
            addedItemGroupsId: addedItemGroups ?? [],
            updatedItemGroupsId: toUpdate.map(({ groupId }) => groupId)
        };

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

    saveOne(
        params: OrmParams
    ) {
        const orm = this.makeOrm(params);
        return this.repo.save(orm);
    }

    /**
     * 
     * @param manager 
     * @param payloads 
     * @returns 
     */

    async saveManyWithManager(
        manager: EntityManager,
        params: OrmParams[]
    ): Promise<(DeepPartial<ItemGroup> & ItemGroup)[]> {

        const orm = this.makeManyOrm(params);

        // Guardamos
        const itemGroups = await manager.save(
            ItemGroup,
            orm
        );

        return itemGroups;

    }

    /**
     * 
     * UPDATERS
     * 
     */

    /**
     * 
     * 
     * 
     * @param itemGroupId 
     * @param orm 
     * @param returning 
     * @returns 
     */

    async updateOne(
        id: string,
        orm: SafeUpdateOrm
    ): Promise<ItemGroup> {

        const {
            baseCost,
            basePrice,
            costId,
            ...rest
        } = orm;

        const updateGroupParams = {
            ...rest,
            baseCost,
            basePrice
        };

        const updateItemsParams = {
            baseCost,
            basePrice,
            costId
        };

        const promises: Promise<any>[] = [];

        if (!isEmptyObject(updateGroupParams)) {
            promises.push(
                this.resolveUpdate(
                    {id},
                    updateGroupParams
                )
            )
        }

        if(!isEmptyObject(updateItemsParams)){
            promises.push(
                this.updateItems(
                    id,
                    updateItemsParams
                )
            )
        }

        const [raw = {}] = await Promise.all(promises);

        const entity = this.repo.merge(
            new ItemGroup(),
            raw
        )

        return entity;

    }

    private async updateItems(
        id: string,
        params: UpdateItemsParams
    ) {

        const isEmpty = isEmptyObject(params);
        if (isEmpty) return;

        return this.itemService.putManyByGroup(
            id,
            params
        )
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
        id: string
    ) {
        return this.delete({id});
    }

    /**
     * 
     * @param valueId 
     * @returns 
     */

    async deleteByFeatureValue(
        valueId: string
    ) {

        const subQuery = this.repo
            .createQueryBuilder("group")
            .innerJoin(
                "group.featureValues",
                "fv",
            )
            .where("fv.id = :valueId", { valueId })
            .select("group.id");

        const result = await this.repo
            .createQueryBuilder()
            .delete()
            .where(`id IN (${subQuery.getQuery()})`)
            .setParameters(subQuery.getParameters())
            .returning(["id"])
            .execute();

        return result.raw.map(raw => String(raw.id));

    }

    /**
     * 
     * SUBQUERIES
     * 
     */

    /**
     * 
     * Filtra los item group segun los feature values dados
     *  1. Selecciona solo los ids
     * 
     * @param featureValuesId 
     * @returns SelectQueryBuilder<ItemGroup>
     */

    filterByFeatureValuesSubQuery(
        featureValuesId: string[]
    ) {
        return this.repo
            .createQueryBuilder("filterGroup")
            .subQuery()
            .innerJoin("filterGroup.featureValues", "fv")
            .where("fv.id IN (:...valuesId)", { valuesId: featureValuesId })
            .groupBy("filterGroup.id")
            .having("COUNT(DISTINCT fv.id) = :count", {
                count: featureValuesId.length
            })
            .select("filterGroup.id");
    }

    /**
     * 
     * @param itemsId 
     * @returns 
     */

    filterByItemsSubQuery(
        itemsId: string[]
    ) {
        return this.repo
            .createQueryBuilder("filterByItemsGroup")
            .subQuery()
            .innerJoin("filterByItemsGroup.items", "filterByItemsGroupItem")
            .where("filterByItemsGroupItem.id IN (:...filterByItemsItemsId)", {
                filterByItemsItemsId: itemsId
            })
            .groupBy("filterByItemsGroup.id")
            .having("COUNT(DISTINCT filterByItemsGroupItem.id) = :filterByItemsMatchCount", {
                filterByItemsMatchCount: itemsId.length
            })
            .select("filterByItemsGroup.id");
    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * Agregar product items a un item group
     * 
     * @param manager 
     * @param groupId 
     * @param productItemsId 
     */

    async addProductItems(
        groupId: string,
        productItemsId: string[],
        manager: EntityManager | DataSource = this.dataSource
    ) {

        await manager
            .createQueryBuilder()
            .relation(ItemGroup, "items")
            .of(groupId)
            .add(productItemsId);
    }

    /**
     * 
     * Eliminar product items de la relacion
     * con el item group
     * 
     * @param manager 
     * @param groupId 
     * @param productItemsId 
     */

    async setProductItems(
        groupId: string,
        productItemsId: string[],
        manager: EntityManager | DataSource = this.dataSource
    ) {

        await manager
            .createQueryBuilder()
            .relation(ItemGroup, "items")
            .of(groupId)
            .set(productItemsId);

    }

    /**
     * 
     * 
     * 
     * @param manager 
     * @param groupId 
     * @param featureValuesId 
     */

    async setFeatureValues(
        groupId: string,
        featureValuesId: string[],
        manager: EntityManager | DataSource = this.dataSource
    ) {

        await manager
            .createQueryBuilder()
            .relation(ItemGroup, "featureValues")
            .of(groupId)
            .set(featureValuesId)

    }

    /**
     * 
     * @param id 
     * @param featureValuesId 
     * @returns 
     */

    async hasFeatureValues(
        id: string,
        featureValuesId: string[]
    ) {
        const subquery = this.filterByFeatureValuesSubQuery(
            featureValuesId
        );

        return this.repo.createQueryBuilder("group")
            .where(`group.id IN (${subquery.getQuery()})`)
            .setParameters(subquery.getParameters())
            .andWhere("group.id = :id", { id })
            .getExists();

    }

    /**
     * 
     * @param id 
     * @param itemsId 
     * @returns 
     */

    async hasItems(
        id: string,
        itemsId: string[]
    ) {

        const subquery = this.filterByItemsSubQuery(
            itemsId
        )

        return this.repo.createQueryBuilder("group")
            .where(`group.id IN (${subquery.getQuery()})`)
            .setParameters(subquery.getParameters())
            .andWhere("group.id = :id", { id })
            .getExists();

    }

    /**
     * 
     * ORM
     * 
     */

    /**
         * 
         * Crear product item group orm
         * 
         * @param param0 
         * @returns 
         */

    makeOrm({
        productId,
        featureValuesId,
        productItemsId,
        featureGroupId,
        ...rest
    }: OrmParams
    ): DeepPartial<ItemGroup> {

        const orm: DeepPartial<ItemGroup> = {
            ...rest
        };

        if (productId) {
            orm.product = {
                id: productId
            }
        }

        if (featureValuesId?.length) {
            orm.featureValues = featureValuesId.map(id => ({ id }));
        }

        if (productItemsId?.length) {
            orm.items = productItemsId.map(id => ({ id }));
        }

        if (featureGroupId) {
            orm.featureGroup = {
                id: featureGroupId
            }
        }

        return orm;

    }

    /**
     * 
     * Crea el orm de varios product item groups
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