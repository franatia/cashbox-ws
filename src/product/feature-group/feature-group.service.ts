import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import CreateFeatureGroupDto from "./dto/create.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindManyOptions, FindOneOptions, In, Repository } from "typeorm";
import { DataSource } from "typeorm";
import { FeatureGroup } from "../entities/feature-group.entity";
import { ItemService } from "../item/item.service";
import FeatureGroupItem from "../entities/feature-group-item.entity";
import { FeatureDto } from "../features/dto/feature.dto";
import { ItemGroupService } from "../item-group/item-group.service";
import { FeaturesService } from "../features/features.service";
import { ContextFeatureDto } from "./dto/context-feature.dto";
import FeatureGroupQuery, { ItemOrmParams } from "./feature-group.query";
import ItemQuery from "../item/item.query";
import ItemGroupQuery from "../item-group/item-group.query";

type CreateFeatureContextParams = {
    groupId: string;
    productId?: string;
}

@Injectable()
export class FeatureGroupService {
    constructor(

        private readonly query: FeatureGroupQuery,

        private readonly productItemService: ItemService,

        @Inject(forwardRef(() => ItemQuery))
        private readonly productItemQuery : ItemQuery,

        private readonly productItemGroupService: ItemGroupService,
        private readonly productItemGroupQuery : ItemGroupQuery,

        @Inject(forwardRef(() => FeaturesService))
        private readonly featuresService: FeaturesService

    ) { }

    /**
     * 
     * LINKERS
     * 
     */

    async linkedToProject(
        groupId: string,
        projectId: string,
        throwable: boolean = true
    ) {

        const exists = await this.query.exists({
            id: groupId,
            product: {
                project: {
                    id: projectId
                }
            }
        })

        if (!exists && throwable) {
            throw new BadRequestException("Feature group is not linked with project")
        }

        return exists;

    }

    /**
   * 
   * Verifica si el product feature group
   * esta vinculado al id del producto
   * 
   * @param featureGroupId 
   * @param productId 
   * @param throwable 
   * @returns 
   */

    async linkedToProduct(
        featureGroupId: string,
        productId: string,
        throwable: boolean = true
    ) {

        const exists = await this.query.exists({
            id: featureGroupId,
            product: {
                id: productId
            }
        })

        if (!exists && throwable) {
            throw new BadRequestException("Product feature group is not linked with Product");
        }

        return exists;

    }

    /**
       * 
       * Verifica si el id del item pertenece al 
       * product feature group dado
       * 
       * @param itemId 
       * @param groupId 
       * @param throwable 
       * @returns 
       */

    async itemLinkedToGroup(
        itemId: string,
        groupId: string,
        throwable: boolean = true
    ) {

        const exists = await this.query.itemExists({
            id: itemId,
            group: {
                id: groupId
            }
        })

        if (!exists && throwable) {
            throw new BadRequestException("Product feature group item is not linked with group");
        }

        return exists;

    }

    /**
     * 
     * @param groupId 
     * @returns 
     */

    async getProductIdByGroupId(
        groupId: string
    ): Promise<string> {
        const { product } = await this.query.findOneOrFail({
            where: {
                id: groupId
            },
            select: {
                product: true
            },
            relations: {
                product: true
            }
        })

        return product.id;
    }

    /**
     * 
     * HANDLERS
     * 
     */

    /**
     * 
     * @param featureValueId 
     * @returns 
     */

    async handleFeatureValueDelete(
        featureValueId: string
    ) {

        const [deletedItems, deletedItemGroups] = await Promise.all([
            this.productItemQuery.deleteByFeatureValue(featureValueId),
            this.productItemGroupQuery.deleteByFeatureValue(featureValueId)
        ])

        return {
            deletedItems,
            deletedItemGroups
        }
    }

    /**
     * 
     * @param featureId 
     * @returns 
     */

    async handleFeatureDelete(
        featureId: string
    ) {
        const deletedGroups = await this.query.deleteFeatureContextsByFeatureId(featureId);

        return {
            deletedGroups
        };
    }

    /**
     * 
     * HELPERS
     * 
     */

    async includeFeatures(
        featuresId: string[],
        groupId: string
    ) {
        const count = await this.query.itemCount({
            group: {
                id: groupId
            },
            feature: {
                id: In(featuresId)
            }
        })

        return count == featuresId.length;
    }

    /**
     * 
     * CREATORS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    async createOrUpdateFeatureContext(
        params: CreateFeatureContextParams
    ) {

        const { groupId } = params;
        let { productId } = params;

        productId ??= await this.getProductIdByGroupId(groupId);

        const productItemsId = await this.productItemService
            .createManyByFeatureGroup({
                featureGroupId: groupId,
                productId
            });

        const productItemGroupsPayload = await this.productItemGroupService
            .createOrUpdateByFeatureContext({
                featureGroupId: groupId,
                productId,
            })

        return {
            productItemsId,
            ...productItemGroupsPayload
        }

    }

    /**
       * 
       * Crea un product feature gruop
       * 
       * @param dto 
       * @returns 
       */

    async create(
        dto: CreateFeatureGroupDto,
    ) {

        const { productId, features, createFeatureContext } = dto;

        await this.featuresService.validateFeaturesDto(features);

        /**
         * 
         * Creamos product feature group
         * 
         */

        const { id: groupId } = await this.query
            .saveOne({productId});

        /**
         * 
         * Creamos los feature group items
         * 
         */

        const items = await this.createItems(
            groupId,
            features
        )

        const featureGroupItemsId = items.map(item => item.id);

        const basicPayload = {
            featureGroupId: groupId,
            featureGroupItemsId
        }

        if (!createFeatureContext) return basicPayload;

        const featureContextPayload = await this.createOrUpdateFeatureContext({
            groupId,
            productId
        })

        return {
            ...basicPayload,
            ...featureContextPayload
        }

    }

    /**
     * 
     * @param featureGroupId 
     * @param featuresDto 
     * @returns 
     */

    async createItems(
        featureGroupId: string,
        featuresDto: ContextFeatureDto[]
    ): Promise<(DeepPartial<FeatureGroupItem> & FeatureGroupItem)[]> {

        const ormParams : ItemOrmParams[] = featuresDto.map(({id, level, main}) => ({
            featureId: id,
            level,
            main,
            groupId : featureGroupId
        }))

        return this.query.saveManyItems(ormParams);

    }

    /**
     * 
     * DELETE
     * 
     */

    async delete(
        groupId: string
    ) {
        await this.query.deleteOne({
            id: groupId
        })

        return {
            deletedFeatureGroup: groupId
        }
    }

}