import { BaseController } from "@/common/models/crud/base-controller.crud";
import { MovementService } from "./movement.service";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import CreateDto from "./dto/create.dto";
import { CurrentNode, CurrentProject, CurrentSub } from "@/common/decorators/access/token.decorator";
import { joinPaths } from "@/common/helpers/http/path.helper";
import { Paths } from "../constants/paths.enum";
import { AccessConfig, AccessPolicies, AtLeastNodeAccess } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import GetDto from "./dto/get.dto";
import { MovementSearch } from "./movement.search";

@AccessPolicies(
    ProjectMainPolicie
)
@AccessConfig(
    AtLeastNodeAccess
)
@Controller(
    joinPaths(Paths.MOVEMENT)
)
export class MovementController implements BaseController {

    constructor(
        private readonly service : MovementService,
        private readonly search : MovementSearch
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
            from : "stockItemId?",
            to : "context.projectId",
            rule : RelationsRule.STOCK_ITEM_TO_PROJECT
        },
        {
            from : "stockItemId?",
            to : "context.nodeId?",
            rule : RelationsRule.STOCK_ITEM_TO_NODE
        },
        {
            from : "lotId?",
            to : "context.projectId",
            rule : RelationsRule.LOT_TO_PROJECT
        },
        {
            from : "lotId?",
            to : "context.nodeId?",
            rule : RelationsRule.LOT_TO_NODE
        },
        {
            from : "transferItemId?",
            to : "context.projectId",
            rule : RelationsRule.STOCK_TRANSFER_ITEM_TO_PROJECT
        },
        {
            from : "transferItemId?",
            to : "context.nodeId?",
            rule : RelationsRule.STOCK_TRANSFER_ITEM_TO_NODE
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
            from : Paths.PARAM_MOVEMENT_ID,
            to : "context.projectId",
            rule : RelationsRule.STOCK_MOVEMENT_TO_PROJECT
        },
        {
            from : Paths.PARAM_MOVEMENT_ID,
            to : "context.nodeId?",
            rule : RelationsRule.STOCK_MOVEMENT_TO_NODE
        }
    )
    @Get(
        Paths.PARAM_MOVEMENT
    )
    getById(
        @Param(Paths.PARAM_MOVEMENT_ID) id : string
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
     * @param userId 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "stockItemId",
            to : "context.projectId",
            rule : RelationsRule.STOCK_ITEM_TO_PROJECT
        },
        {
            from : "stockItemId",
            to : "context.nodeId?",
            rule : RelationsRule.STOCK_ITEM_TO_NODE
        },
        {
            from : "lotsId[]?",
            to : "stockItemId",
            rule : RelationsRule.LOTS_TO_STOCK_ITEM
        }
    )
    @Post()
    create(
        @Body() dto : CreateDto,
        @CurrentSub() userId : string
    ){
        return this.service.create({
            ...dto,
            userCreatorId : userId
        });
    }

}