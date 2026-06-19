import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from "@nestjs/common";
import { ItemService } from "./item.service";
import { Paths } from "../constants/paths";
import { joinPaths } from "@/common/helpers/http/path.helper";
import CreateDto from "./dto/create.dto";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import UpdateDto from "./dto/update.dto";
import GetDto from "./dto/get.dto";
import ItemSearch from "./item.search";
import { CurrentProject } from "@/common/decorators/access/token.decorator";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import UpdateManyDto from "./dto/update-many.dto";

@Controller(joinPaths(Paths.PRODUCT, Paths.ITEMS))
@AccessPolicies(
    ProjectMainPolicie
)
export default class ItemController {

    constructor(
        private readonly service: ItemService,
        private readonly search: ItemSearch
    ) { }

    /**
     * 
     * POST
     * 
     */

    @RelationsConfig(
        {
            from: "productId",
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_TO_PROJECT
        }
    )
    @Post()
    async create(
        @Body() dto: CreateDto
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
     * @param itemId 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from: Paths.PARAM_ITEM_ID,
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEM_TO_PROJECT
        },
        {
            from : "costId?",
            to : "context.projectId",
            rule : RelationsRule.COST_TO_PROJECT
        }
    )
    @Put(Paths.PARAM_ITEM)
    put(
        @Param(Paths.PARAM_ITEM_ID, ParseUUIDPipe) itemId: string,
        @Body(new StripUndefinedPipe()) dto: UpdateDto
    ) {
        return this.service.put(
            itemId,
            dto
        );
    }

    /**
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "itemsId[]",
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_ITEMS_TO_PROJECT
        },
        {
            from : "costId?",
            to : "context.projectId",
            rule : RelationsRule.COST_TO_PROJECT
        }
    )
    @Put()
    putMany(
        @Body(new StripUndefinedPipe()) dto : UpdateManyDto
    ){

        return this.service.putMany(
            dto
        );

    }

    /**
     * 
     * DELETE
     * 
     */

    @RelationsConfig(
        {
            from: Paths.PARAM_ITEM_ID,
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEM_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_ITEM)
    async delete(
        @Param(Paths.PARAM_ITEM_ID, ParseUUIDPipe) itemId: string
    ) {
        return this.service.delete(itemId);
    }

    /**
     * 
     * GET
     * 
     */

    /**
     * 
     * Get general
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from: "productId?",
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_TO_PROJECT
        },
        {
            from: "itemGroupId?",
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEM_GROUP_TO_PROJECT
        },
        {
            from: "featureGroupId?",
            to: "context.projectId",
            rule: RelationsRule.FEATURE_GROUP_TO_PROJECT
        },
        {
            from: "featureValuesId[]?",
            to: "context.projectId",
            rule: RelationsRule.FEATURE_VALUES_TO_PROJECT
        }
    )
    @Get()
    async get(
        @Query(new StripUndefinedPipe()) dto: GetDto,
        @CurrentProject() projectId: string,
    ) {
        return this.search.get({
            projectId,
            ...dto
        });
    }

    /**
     * 
     * Buscamos segun id
     * 
     * @param id 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from: Paths.PARAM_ITEM_ID,
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEM_TO_PROJECT
        }, {
        from: "productId?",
        to: "context.projectId",
        rule: RelationsRule.PRODUCT_TO_PROJECT
    }, {
        from: "itemGroupId?",
        to: "context.projectId",
        rule: RelationsRule.PRODUCT_ITEM_GROUP_TO_PROJECT
    }, {
        from: "featureGroupId?",
        to: "context.projectId",
        rule: RelationsRule.FEATURE_GROUP_TO_PROJECT
    }, {
        from: "featureValuesId[]?",
        to: "context.projectId",
        rule: RelationsRule.FEATURE_VALUES_TO_PROJECT
    }
    )
    @Get(Paths.PARAM_ITEM)
    async getById(
        @Param(Paths.PARAM_ITEM_ID, ParseUUIDPipe) id: string,
        @CurrentProject() projectId: string
    ) {
        return this.search.getById(id, projectId)
    }

}