import { InjectRepository } from "@nestjs/typeorm";
import { FeatureGroup } from "../entities/feature-group.entity";
import { DataSource, DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import FeatureGroupItem from "../entities/feature-group-item.entity";
import { BadRequestException, Injectable } from "@nestjs/common";

type OrmParams = {
    productId: string
}

export type ItemOrmParams = {
    featureId: string,
    groupId: string,
    level: number,
    main?: boolean,
}

@Injectable()
export default class FeatureGroupQuery {
    constructor(
        @InjectRepository(FeatureGroup)
        private readonly repo: Repository<FeatureGroup>,

        @InjectRepository(FeatureGroupItem)
        private readonly itemRepo: Repository<FeatureGroupItem>,

        private readonly dataSource: DataSource,
    ) { }

    /**
     * 
     * EXISTS
     * 
     */

    exists(
        where: FindOptionsWhere<FeatureGroup>
    ) {
        return this.repo.exists({
            where
        })
    }

    itemExists(
        where: FindOptionsWhere<FeatureGroupItem>
    ) {
        return this.itemRepo.exists({
            where
        })
    }

    /**
     * 
     * COUNT
     * 
     */

    count(
        where: FindOptionsWhere<FeatureGroup>
    ) {
        return this.repo.count({
            where
        })
    }

    itemCount(
        where: FindOptionsWhere<FeatureGroupItem>
    ) {
        return this.itemRepo.count({
            where
        })
    }

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

    async findMany(
        options: FindManyOptions<FeatureGroup>
    ): Promise<FeatureGroup[]> {
        return this.repo.find(options);
    }

    /**
     * 
     * @param options 
     */

    async findOne(
        options: FindOneOptions<FeatureGroup>
    ) {

        return this.repo.findOne(options);

    }

    /**
     * 
     * @param options 
     * @returns 
     */

    async findOneOrFail(
        options: FindOneOptions<FeatureGroup>
    ): Promise<FeatureGroup> {

        const group = await this.findOne(options);

        if (!group) {
            throw new BadRequestException("Product feature group was not found");
        }

        return group;

    }

    /**
     * 
     * @param groupId 
     * @returns 
     */

    async findDetailedItemsById(
        groupId: string
    ): Promise<FeatureGroupItem[]> {

        const group = await this.itemRepo
            .createQueryBuilder("item")
            .innerJoinAndSelect(
                "item.feature",
                "feature"
            )
            .innerJoinAndSelect(
                "feature.values",
                "featureValue"
            )
            .where("item.groupId = :groupId", { groupId })
            .getMany();

        return group;

    }

    /**
 * 
 * @param groupId 
 */

    async findMainItem(
        groupId: string
    ) {
        const mainItem = await this.itemRepo.createQueryBuilder("item")
            .innerJoinAndSelect(
                "item.feature",
                "feature"
            )
            .leftJoin(
                "feature.product",
                "product"
            )
            .innerJoinAndSelect(
                "feature.values",
                "fv"
            )
            .where("item.groupId = :groupId", { groupId })
            .andWhere("item.main = :main", { main: true })
            .addSelect(
                ["product.id"]
            )
            .getOne();

        if (!mainItem) {
            throw new BadRequestException("Feature group has not main item");
        }

        return mainItem;

    }

    /**
     * 
     * SAVERS
     * 
     */

    saveOne(
        params : OrmParams
    ){
        const orm = this.makeOrm(params);
        return this.repo.save(orm);
    }

    saveManyItems(
        params : ItemOrmParams[]
    ){
        return this.dataSource.transaction(async manager => {

            // Creamos los payloads
            const orm = this.makeManyItemsOrm(params);

            const items = await manager.save(
                FeatureGroupItem,
                orm
            )

            return items;

        })
    }

    /**
     * 
     * SUBQUERY
     * 
     */

    /**
     * 
     * @param featuresId 
     * @returns 
     */

    async filterByFeaturesSubQuery(
        featuresId: string[]
    ) {
        const subquery = this.repo
            .createQueryBuilder("filterByFeaturesGroup")
            .subQuery()
            .innerJoin("filterByFeaturesGroup.items", "filterByFeaturesGroupItem")
            .andWhere("filterByFeaturesGroupItem.featureId IN (:...filterByFeaturesFeaturesId)", {
                filterByFeaturesFeaturesId: featuresId
            })
            .groupBy("filterByFeaturesGroup.id")
            .having("COUNT(DISTINCT filterByFeaturesGroupItem.id) = :filterByFeaturesGroupCount", {
                filterByFeaturesGroupCount: featuresId.length
            })
            .select("filterByFeaturesGroup.id");

        return subquery;
    }

    /**
     * 
     * DELETE
     * 
     */

    deleteOne(
        where : FindOptionsWhere<FeatureGroup>
    ){
        return this.repo.delete(where)
    }

    /**
     * 
     * @param featureId 
     * @returns 
     */

    async deleteFeatureContextsByFeatureId(
        featureId: string
    ) {

        const subQuery = this.repo
            .createQueryBuilder("featureGroup")
            .innerJoin("featureGroup.items", "item")
            .where("item.featureId = :featureId", { featureId })
            .select("featureGroup.id");

        const { raw } = await this.repo
            .createQueryBuilder()
            .delete()
            .where(`id IN (${subQuery.getQuery()})`)
            .setParameters(subQuery.getParameters())
            .returning(["id"])
            .execute();

        return raw.map(raw => String(raw.id));

    }

    /**
     * 
     * ORM
     * 
     */

    private makeOrm(
        params: OrmParams
    ): DeepPartial<FeatureGroup> {
        const {
            productId
        } = params;

        return {
            product: {
                id: productId
            }
        }
    }

    private makeItemOrm(
        params: ItemOrmParams
    ): DeepPartial<FeatureGroupItem> {

        const {
            featureId,
            groupId,
            level,
            main = false
        } = params;

        return {
            feature: {
                id: featureId
            },
            group: {
                id: groupId
            },
            main,
            level
        }

    }

    private makeManyItemsOrm(
        params : ItemOrmParams[]
    ){
        return params.map(param => (
            this.makeItemOrm(param)
        ))
    }

}