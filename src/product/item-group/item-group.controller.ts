import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ItemGroupService } from "./item-group.service";
import { Paths } from "../constants/paths";
import { joinPaths } from "@/common/helpers/path.helper";
import CreateDto from "./dto/create.dto";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import UpdateDto from "./dto/update.dto";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import UpdateFeatureValuesDto from "./dto/update-feature-values.dto";
import UpdateItemsDto from "./dto/update-items.dto";
import GetDto from "./dto/get.dto";
import ItemGroupSearch from "./item-group.search";
import { CurrentProject } from "@/common/decorators/token.decorator";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";

const basicGetRelationsConfig = [
    {
        from: "productId?",
        to: "context.projectId",
        rule: RelationsRule.PRODUCT_TO_PROJECT
    }, {
        from: "featureGroupId?",
        to: "context.projectId",
        rule: RelationsRule.FEATURE_GROUP_TO_PROJECT
    }, {
        from: "featureValuesId[]?",
        to: "context.projectId",
        rule: RelationsRule.FEATURE_VALUES_TO_PROJECT
    }
];

@Controller(joinPaths(Paths.PRODUCT, Paths.ITEM_GROUP))
@AccessPolicies(
    ProjectMainPolicie
)
export default class ItemGroupController {

    constructor(
        private readonly service: ItemGroupService,
        private readonly search: ItemGroupSearch
    ) { }

    /**
     * 
     * GET
     * 
     */

    /**
     * 
     * Buscamos segun filtros de busqueda
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        ...basicGetRelationsConfig
    )
    @Get()
    async get(
        @Query(new StripUndefinedPipe()) dto: GetDto,
        @CurrentProject() projectId : string,
    ) {
        return this.search.get({
            projectId,
            ...dto
        });
    }

    /**
     * 
     * Buscamos segun id y filtros de busqueda
     * 
     * @param id 
     * @param dto 
     * @returns 
     */
    @RelationsConfig(
        {
            from: Paths.PARAM_ITEM_GROUP_ID,
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEM_GROUP_TO_PROJECT
        },
        ...basicGetRelationsConfig
    )
    @Get(Paths.PARAM_ITEM_GROUP_ID)
    async getById(
        @Param(Paths.PARAM_ITEM_GROUP_ID, new ParseUUIDPipe()) id: string,
    ) {
        return this.search.getById(
            id
        )
    }

    /**
     * 
     * POST
     * 
     */

    /**
     * 
     * Crea el grupo
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from: "productId",
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_TO_PROJECT
        },
        {
            from: "productItemsId[]?",
            to: "productId",
            rule: RelationsRule.PRODUCT_ITEMS_TO_PRODUCT
        },
        {
            from: "featureValuesId[]?",
            to: "productId",
            rule: RelationsRule.FEATURE_VALUES_TO_PRODUCT
        }
    )
    @Post()
    async create(
        @Body(new StripUndefinedPipe()) dto: CreateDto,
    ) {
        return this.service.create(dto);
    }

    /**
     * 
     * PUT
     * 
     */

    /**
     * 
     * Edita datos no relacionales
     * de la entidad
     * 
     * @param groupId 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from: Paths.PARAM_ITEM_GROUP_ID,
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEM_GROUP_TO_PROJECT
        }
    )
    @Put(Paths.PARAM_ITEM_GROUP)
    put(
        @Param(Paths.PARAM_ITEM_GROUP_ID, new ParseUUIDPipe()) groupId: string,
        @Body(new StripUndefinedPipe()) dto: UpdateDto
    ) {
        return this.service.put(groupId, dto);
    }

    /**
     * 
     * PATCH
     * 
     */

    /**
     * 
     * Setea los features
     * solo si el grupo es de tipo FEATURES
     * 
     * @param groupId 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from: "featureValuesId[]",
            to: "context.projectId",
            rule: RelationsRule.FEATURE_VALUES_TO_PROJECT
        },
        {
            from: Paths.PARAM_ITEM_GROUP_ID,
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEM_GROUP_TO_PROJECT
        },
        {
            from: "featureValuesId[]",
            to: Paths.PARAM_ITEM_GROUP,
            rule: RelationsRule.FEATURE_VALUES_RELATED_TO_PRODUCT_ITEM_GROUP
        }
    )
    @Patch(joinPaths(Paths.FEATURE_VALUES, Paths.PARAM_ITEM_GROUP))
    patchFeatureValues(
        @Param(Paths.PARAM_ITEM_GROUP_ID, new ParseUUIDPipe()) groupId: string,
        @Body() dto: UpdateFeatureValuesDto
    ) {
        return this.service.patchFeatureValues(
            groupId,
            dto
        )
    }

    /**
     * 
     * Setea los product items
     * solo si el grupo es de tipo ITEMS
     * 
     * @param groupId 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from: "itemsId[]",
            to: "projectId",
            rule: RelationsRule.PRODUCT_ITEMS_TO_PROJECT
        },
        {
            from: Paths.PARAM_ITEM_GROUP_ID,
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEM_GROUP_TO_PROJECT
        },
        {
            from: "itemsId[]",
            to: Paths.PARAM_ITEM_GROUP_ID,
            rule: RelationsRule.PRODUCT_ITEMS_RELATED_TO_PRODUCT_ITEM_GROUP
        }
    )
    @Patch(joinPaths(Paths.ITEMS, Paths.PARAM_ITEM_GROUP))
    patchItems(
        @Param(Paths.PARAM_ITEM_GROUP_ID, new ParseUUIDPipe()) groupId: string,
        @Body() dto: UpdateItemsDto
    ) {
        return this.service.patchItems(
            groupId,
            dto
        )
    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * Elimina el grupo
     * solo si no pertenece a un feature group
     * 
     * @param groupId 
     * @returns 
     */

    @RelationsConfig(
        {
            from: Paths.PARAM_ITEM_GROUP_ID,
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEM_GROUP_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_ITEM_GROUP)
    delete(
        @Param(Paths.PARAM_ITEM_GROUP_ID, new ParseUUIDPipe()) groupId: string
    ) {

        return this.service.delete(
            groupId
        )

    }

}