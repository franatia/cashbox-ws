import { BaseController } from "@/common/models/crud/base-controller.crud";
import { ItemService } from "./item.service";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { joinPaths } from "@/common/helpers/http/path.helper";
import { Paths } from "../constants/paths.enum";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import CreateDto from "./dto/create.dto";
import { AccessConfig, AccessPolicies, AtLeastNodeAccess } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import GetDto from "./dto/get.dto";
import { CurrentNode, CurrentProject } from "@/common/decorators/access/token.decorator";
import { ItemSearch } from "./item.search";

@AccessPolicies(
    ProjectMainPolicie
)
@AccessConfig(
    AtLeastNodeAccess
)
@Controller(
    joinPaths(
        Paths.STOCK,
        Paths.ITEM
    )
)
export class ItemController implements BaseController {

    constructor(
        private readonly service : ItemService,
        private readonly search : ItemSearch
    ){}

    /**
     * 
     * GET
     * 
     */

    /**
     * 
     * @param dto 
     * @param projectId 
     * @param nodeId 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "stockId?",
            to : "context.projectId",
            rule : RelationsRule.STOCK_TO_PROJECT
        }
    )
    @Get()
    get(
        @Query() dto : GetDto,
        @CurrentProject() projectId : string,
        @CurrentNode({optional : true}) nodeId ?: string
    ){
        return this.search.get({
            ...dto,
            projectId,
            nodeId
        })
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_ITEM_ID,
            to : "context.projectId",
            rule : RelationsRule.STOCK_ITEM_TO_PROJECT
        },
        {
            from : Paths.PARAM_ITEM_ID,
            to : "context.nodeId?",
            rule : RelationsRule.STOCK_ITEM_TO_NODE
        }
    )
    @Get(
        Paths.PARAM_ITEM
    )
    getById(
        @Param(Paths.PARAM_ITEM_ID) id : string
    ){
        return this.search.getById(id);
    }

    /**
     * 
     * POST
     * 
     */

    /**
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "stockId",
            to : "context.projectId",
            rule : RelationsRule.STOCK_TO_PROJECT
        },
        {
            from : "productItemId",
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_ITEM_TO_PROJECT
        },
        {
            from : "stockId",
            to : "productItemId",
            rule : RelationsRule.STOCK_TO_PRODUCT_ITEM
        }
    )
    @Post()
    create(
        @Body(new StripUndefinedPipe()) dto : CreateDto
    ){
        return this.service.create(dto);
    }

}