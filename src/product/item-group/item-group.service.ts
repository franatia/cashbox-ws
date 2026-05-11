import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common"
import { Item } from "../entities/item.entity"
import { ItemService } from "../item/item.service"
import { ItemGroup, ItemGroupType } from "../entities/item-group.entity"
import { In } from "typeorm"
import CreateDto from "./dto/create.dto"
import FeatureGroupItem from "../entities/feature-group-item.entity"
import { Feature } from "../entities/feature.entity"
import UpdateDto from "./dto/update.dto"
import UpdateFeatureValuesDto from "./dto/update-feature-values.dto"
import UpdateItemsDto from "./dto/update-items.dto"
import ItemGroupQuery from "./item-group.query"
import ItemQuery from "../item/item.query"
import FeatureGroupQuery from "../feature-group/feature-group.query"

/**
 * 
 * CREATE PARAMS
 * 
 */

type CreateByFeatureContextParams = {
    featureGroupId: string,
    productId?: string,
    mainFeature?: FeatureGroupItem,
    items?: Item[]
}

/**
 * 
 * 
 */

type CreateGroupParams = {

    name?: string,
    basePrice?: number,
    webVisibility?: boolean,
    featureGroupId?: string,
    productId?: string,
    type?: ItemGroupType,
    productItemsId?: string[],
    featureValuesId?: string[],

}

type UpdateGroupParams = {

    groupId: string,
    itemsId: string[]

}

@Injectable()
export class ItemGroupService {

    constructor(

        private readonly itemService: ItemService,

        @Inject(forwardRef(() => ItemQuery))
        private readonly itemQuery: ItemQuery,

        private readonly query: ItemGroupQuery,

        private readonly featureGroupQuery : FeatureGroupQuery

    ) { }

    /**
     * 
     * LINKERS
     * 
     */

    linkedToProject(
        groupId: string,
        productId: string,
        throwable: boolean = true
    ): Promise<boolean> {
        const exists = this.query.exists({
            id: groupId,
            product: {
                project: {
                    id: productId
                }
            }
        })

        if (!exists && throwable) {
            throw new BadRequestException("Item group is not linked with project");
        }

        return exists;
    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param groupId 
     * @returns 
     */

    async hasType(
        groupId: string,
        groupType: ItemGroupType
    ): Promise<boolean> {

        const exists = await this.query.exists({
            id: groupId,
            type: groupType
        })

        return exists;

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
        return this.query.hasFeatureValues(
            id,
            featureValuesId
        )
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

        return this.query.hasItems(
            id,
            itemsId
        )

    }

    /**
     * 
     * BUILDERS
     * 
     */

    async buildTransactionContext(

        productId: string,
        featureGroupId: string,
        mainFeature: Feature,
        productItems: Item[],
        groups: ItemGroup[]

    ): Promise<{
        toUpdate: UpdateGroupParams[],
        toCreate: CreateGroupParams[]
    }> {

        const itemsIdByValueId = this.itemService
            .mapItemsIdByFeatureValueId(productItems);

        const groupsByValueId = this.mapByFeatureValueId(
            groups
        )

        const toUpdate: UpdateGroupParams[] = [];
        const toCreate: CreateGroupParams[] = [];

        for (const value of mainFeature.values) {

            const { id: valueId } = value;

            const productItemsId = itemsIdByValueId.get(valueId) ?? [];

            const group = groupsByValueId.get(valueId);

            if (group) {
                const existingItems = new Set(group.items.map(p => String(p.id)));
                const addedItems = productItemsId.filter(id => !existingItems.has(id));

                if (addedItems.length) {
                    toUpdate.push({ groupId: group.id, itemsId: addedItems });
                }

                continue;
            }

            toCreate.push({
                productId,
                productItemsId,
                featureValuesId: [valueId],
                featureGroupId,
                type: ItemGroupType.FEATURE_GROUP
            });
        }

        return {
            toCreate,
            toUpdate
        }

    }

    /**
     * 
     * MAPPING
     * 
     */

    /**
     * 
     * @param productItemGroups 
     * @returns 
     */

    mapByFeatureValueId(
        productItemGroups: ItemGroup[]
    ): Map<string, ItemGroup> {

        const groupsByValueId = new Map<string, ItemGroup>();

        for (const group of productItemGroups) {

            const fv = group.featureValues[0];

            if (!fv) continue;

            groupsByValueId.set(fv.id, group)

        }

        return groupsByValueId;
    }



    /**
     * 
     * CREATE
     * 
     */

    /**
     * 
     * @param productId 
     * @param featureGroupId 
     * @param mainFeature 
     * @param productItems 
     * @returns 
     */

    async createOrUpdateByFeatureContext(
        params: CreateByFeatureContextParams
    ) {

        let {
            featureGroupId,
            productId,
            items
        } = params;

        const { feature: mainFeature } = await this.featureGroupQuery
            .findMainItem(featureGroupId);

        productId ??= mainFeature.product!.id;

        items ??= await this.itemQuery.findByFeatureContext({
            featureGroupId,
            featureValuesId: mainFeature.values.map(v => v.id)
        })


        return this.saveOrUpdateByFeatureContext(
            productId,
            featureGroupId,
            mainFeature,
            items
        )

    }

    /**
       * 
       * Crea un item group de forma manual para determinados features o items.
       * 
       * @param createItemGroupDto 
       * @returns 
       */

    async create(
        createItemGroupDto: CreateDto
    ): Promise<ItemGroup> {

        const {
            productId,
            featureValuesId,
            webVisibility,
            basePrice,
            name,
            type: groupType
        } = createItemGroupDto;

        let { itemsId } = createItemGroupDto;

        /**
         * 
         * VALIDAMOS DATOS
         * 
         */

        const isFeatureType = groupType === ItemGroupType.FEATURES;
        const hasFeatureValues = !!featureValuesId?.length;

        const isItemType = groupType === ItemGroupType.ITEMS;
        const hasProductItems = !!itemsId?.length;


        if (isFeatureType && !hasFeatureValues) {
            throw new BadRequestException("Feature values are required");
        }

        if (isItemType && !hasProductItems) {
            throw new BadRequestException("Product items are required");
        }

        /**
         * 
         * PREPARAMOS DATOS
         * 
         */

        itemsId = (isFeatureType)
            ? await this.itemQuery.findIdsByFeatureValues(
                featureValuesId!!
            )
            : itemsId;

        /**
         * 
         * GUARDAMOS
         * 
         */

        const productItemGroup = await this.query.saveOne({
            productId,
            featureValuesId: featureValuesId ?? [],
            productItemsId: itemsId ?? [],
            basePrice,
            webVisibility,
            name,
            type: groupType
        });

        return productItemGroup;

    }

    /**
         * 
         * @param productId 
         * @param featureGroupId 
         * @param mainFeature 
         * @param productItems 
         * @returns 
         */

    async saveOrUpdateByFeatureContext(
        productId: string,
        featureGroupId: string,
        mainFeature: Feature,
        productItems: Item[]
    ) {

        const mainFeatureValuesId = mainFeature.values.map(value => value.id);
        const existingGroups = await this.query.findByFeatureContext(
            featureGroupId,
            mainFeatureValuesId
        )

        const transactionContext = await this.buildTransactionContext(
            productId,
            featureGroupId,
            mainFeature,
            productItems,
            existingGroups
        )


        const payloadReturn = await this.query.runContextTransaction(
            transactionContext.toUpdate,
            transactionContext.toCreate
        )

        return payloadReturn;

    }

    /**
     * 
     * PUT
     * 
     */

    /**
     * 
     * @param groupId 
     * @param dto 
     * @returns 
     */

    async put(
        groupId: string,
        dto: UpdateDto
    ) {

        if (!Object.entries(dto).length) return;

        const {
            basePrice,
            name,
            webVisibility
        } = dto;

        return this.query.updateOne(
            groupId,
            {
                basePrice,
                name,
                webVisibility
            }
        );

    }

    /**
     * 
     * PATCH
     * 
     */

    /**
     * 
     * @param groupId 
     * @param dto 
     * @returns 
     */

    async patchFeatureValues(
        groupId: string,
        dto: UpdateFeatureValuesDto
    ) {

        const {
            featureValuesId
        } = dto;

        const isFeaturesType = await this.hasType(
            groupId,
            ItemGroupType.FEATURES
        )

        if (!isFeaturesType) {
            throw new BadRequestException("Product item group is not a features type group");
        }

        await this.query.setFeatureValues(
            groupId,
            featureValuesId
        );

        const items = await this.itemQuery.findByFeatureContext({
            featureValuesId
        })

        return this.patchItems(
            groupId,
            {
                itemsId: items.map(({ id }) => id)
            }
        )

    }

    /**
     * 
     * @param groupId 
     * @param dto 
     * @returns 
     */

    async patchItems(
        groupId: string,
        dto: UpdateItemsDto
    ) {
        const {
            itemsId
        } = dto;

        await this.query.setProductItems(
            groupId,
            itemsId
        )

        return this.query.findOneOrFail({
            where: {
                id: groupId
            },
            relations: {
                items: true,
                featureValues: true
            }
        })

    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * Borra solo item groups que no
     * pertenezcan a un feature group
     * 
     * @param groupId 
     * @returns 
     */

    async delete(
        groupId: string
    ) {

        return this.query.deleteOne({
            id: groupId,
            type: In([
                ItemGroupType.FEATURES,
                ItemGroupType.ITEMS
            ])
        })

    }

}