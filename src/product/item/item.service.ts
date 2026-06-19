import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { In, IsNull } from "typeorm";
import { Item } from "../entities/item.entity";
import { FeaturesService } from "../features/features.service";
import CreateDto from "./dto/create.dto";
import { buildSku, SkuPrefix } from "@/common/helpers/entities/sku.helper";
import UpdateDto from "./dto/update.dto";
import CreateManyByFeatureGroupDto from "./dto/create-many-feature-context.dto";
import {ItemQuery} from "./item.query";
import FeatureGroupQuery from "../feature-group/feature-group.query";
import UpdateManyDto from "./dto/update-many.dto";

/**
 * 
 * CONTEXTS
 * 
 */


/**
 * 
 * PAYLOADS
 * 
 */

@Injectable()
export class ItemService {

    constructor(

        @Inject(forwardRef(() => ItemQuery))
        private readonly query: ItemQuery,

        @Inject(forwardRef(() => FeaturesService))
        private readonly featureService: FeaturesService,

        private readonly featureGroupQuery: FeatureGroupQuery

    ) { }

    /**
     * 
     * LINKERS
     * 
     */

    async linkedToProject(
        id: string,
        projectId: string,
        throwable: boolean = true
    ) {

        const exists = await this.query.exists({
            id,
            product: {
                project: {
                    id: projectId
                }
            }
        });

        if (!exists && throwable) throw new BadRequestException("Product item does not correspond toward project");

        return exists;

    }

    async manyLinkedToProject(
        ids: string[],
        projectId: string,
        throwable: boolean = true
    ) {

        const count = await this.query.count({
            id: In(ids),
            product: {
                project: {
                    id: projectId
                }
            }
        });

        const isExists = count === ids.length;

        if (!isExists && throwable) throw new BadRequestException("All product items are not correspond toward project");

        return isExists;

    }

    async linkedToCost(
        id : string,
        costId : string,
        throwable : boolean = true
    ){

        const exists = await this.query.exists({
            id,
            cost : {
                id : costId
            }
        });

        if(!exists && throwable){
            throw new BadRequestException(
                "Product item is not linked with cost"
            )
        }

        return exists;

    }

    /**
     * 
     * Verifica si los items de producto dados
     * estan relacionados al producto.
     * 
     * @param itemIds 
     * @param productId 
     */

    async manyLinkedToProduct(
        ids: string[],
        productId: string,
        throwable: boolean = true
    ) {

        const count = await this.query.count({
            id: In(ids),
            product: {
                id: productId
            }
        })

        const exists = count === ids.length;

        if (!exists && throwable) {
            throw new BadRequestException("All product items are not linked with the product");
        }

        return exists;

    }

    async manyNotLinkedToProduct(
        ids: string[],
        productId: string,
        throwable: boolean = true
    ) {

        const count = await this.query.count({
            id: In(ids),
            product: {
                id: productId
            }
        })

        const exists = count === 0;

        if (!exists && throwable) {
            throw new BadRequestException("Some items are linked with the product");
        }

        return exists;

    }

    /**
   * 
   * Verifica si los items de producto dados
   * estan relacionados al producto.
   * 
   * @param itemIds 
   * @param productId 
   */

    async linkedToProduct(
        id: string,
        productId: string,
        throwable: boolean = true
    ) {

        const isExists = await this.query.exists({
            id: id,
            product: {
                id: productId
            }
        })

        if (!isExists && throwable) {
            throw new BadRequestException("All product items are not linked with the product");
        }

        return isExists;

    }

    /**
     * 
     * UTILS
     * 
     */

    async ensureFeatures(
        featureGroupId: string
    ) {
        const featureGroupItems = await this.featureGroupQuery.findDetailedItemsById(
            featureGroupId
        )

        return this.featureService.buildDtoByGroupItems(
            featureGroupItems
        )

    }

    /**
     * 
     * MAPPING
     * 
     */

    mapItemsIdByFeatureValueId(
        productItems: Item[]
    ): Map<string, string[]> {

        const itemsIdByValueId = new Map<string, string[]>()

        for (const item of productItems) {

            for (const value of item.featureValues) {

                if (!itemsIdByValueId.has(value.id)) {
                    itemsIdByValueId.set(value.id, []);
                }

                itemsIdByValueId.get(value.id)?.push(item.id);

            }

        }

        return itemsIdByValueId;
    }

    /**
     * 
     * CREATORS
     * 
     */

    /**
       * 
       * Crea los product items dado un grupo
       * de features, los cuales se combinaran
       * para dar lugar a los items. Posteriormente
       * segun el feature principal seleccionado,
       * segmenta los items en item groups. Es encargado
       * de guardar todas las entidades intervinientes.
       * 
       * @param createProductItems 
       * @returns 
       */

    async createManyByFeatureGroup(
        dto: CreateManyByFeatureGroupDto
    ) {

        const { productId, featureGroupId } = dto;

        /**
         * 
         * Preparamos datos
         * 
         */

        const features = await this.ensureFeatures(
            featureGroupId!
        );

        /**
         * 
         * Creamos product items
         * 
         */

        const items = await this.query.prepareAndSaveByFeatureContext(
            productId,
            features!,
            featureGroupId
        );

        return items;

    }

    /**
       * 
       * Pensado para crear items del producto sin features.
       * 
       * @param createProductItemDto 
       * @returns 
       */

    async create(
        dto: CreateDto
    ) {

        const { productId, name } = dto;

        /**
         * 
         * Preparamos los datos
         * 
         */

        const sku = buildSku(SkuPrefix.PRODUCT_ITEM)

        /**
         * 
         * Guardamos
         * 
         */

        const productItem = await this.query.saveOne({
            productId,
            sku,
            name
        });

        return productItem;
    }

    /**
     * 
     * PUT
     * 
     */

    /**
     * 
     * Editar product item
     * 
     * @param productItemId 
     * @param dto 
     * @returns 
     */

    async put(
        itemId: string,
        dto: UpdateDto
    ) {

        const newItem = await this.query.updateOne(
            itemId,
            dto
        )

        return newItem;

    }

    async putMany(
        dto : UpdateManyDto
    ){

        const {
            itemsId,
            ...rest
        } = dto;

        return this.query.updateSameContent(
            {
                itemsId
            },
            rest
        )

    }

    /**
     * 
     * @param groupId 
     * @param params 
     */

    putManyByGroup(
        groupId : string,
        params : UpdateDto
    ){

        return this.query.updateSameContent(
            {
                itemGroupId: groupId
            },
            params
        );

    }

    putManyByProduct(
        productId : string,
        params : UpdateDto
    ){
        return this.query.updateSameContent(
            {
                productId
            },
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
     * Borra solo items con feature group en null
     * 
     * @param itemId 
     * @returns 
     */

    async delete(
        itemId: string
    ) {

        return this.query.deleteOne({
            id: itemId,
            featureGroup: IsNull()
        })

    }

}