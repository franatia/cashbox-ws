import { BaseController } from "@/common/models/crud/base-controller.crud";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { LotService } from "./lot.service";
import { joinPaths } from "@/common/helpers/http/path.helper";
import { Paths } from "../constants/paths.enum";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import { AccessConfig, AccessPolicies, AtLeastNodeAccess } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import UpdateDto from "./dto/update.dto";
import GetDto from "./dto/get.dto";
import { CurrentNode, CurrentProject } from "@/common/decorators/access/token.decorator";
import LotSearch from "./lot.search";
import CreateLotDto from "./dto/create-lot.dto";
import CreateLotsDto from "./dto/create-lots.dto";

@AccessPolicies(
    ProjectMainPolicie
)
@AccessConfig(
    AtLeastNodeAccess
)
@Controller(
    joinPaths(Paths.STOCK, Paths.LOT)
)
export default class LotController implements BaseController {

    constructor(
        private readonly service : LotService,
        private readonly search : LotSearch
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
        },
        {
            from : "stockItemId?",
            to : "context.projectId",
            rule : RelationsRule.STOCK_ITEM_TO_PROJECT
        },
        {
            from : "stockItemId?",
            to : "context.nodeId?",
            rule : RelationsRule.STOCK_ITEM_TO_NODE
        }
    )
    @Get()
    get(
        @Query() dto : GetDto,
        @CurrentProject() projectId : string,
        @CurrentNode({optional : true}) nodeId ?: string,
    ){
        return this.search.get(
            {
                ...dto,
                projectId,
                nodeId
            }
        )
    }
    
    /**
     * 
     * @param id 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_LOT_ID,
            to : "context.projectId",
            rule : RelationsRule.LOT_TO_PROJECT
        },
        {
            from : Paths.PARAM_LOT_ID,
            to : "context.nodeId?",
            rule : RelationsRule.LOT_TO_NODE
        }
    )
    @Get(Paths.PARAM_LOT)
    getById(
        @Param(Paths.PARAM_LOT_ID) id : string
    ){
        return this.search.getById(id);
    }

    /**
     * 
     * CREATE
     * 
     */

    /**
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "productItem.id",
            to : "context.projectId",
            rule : RelationsRule.STOCK_ITEM_TO_PROJECT
        },
        {
            to : "productItem.id",
            from : "productItem.costId",
            rule : RelationsRule.COST_TO_PRODUCT_ITEM
        }
    )
    @Post()
    create(
        @Body(new StripUndefinedPipe()) dto : CreateLotDto
    ){

        return this.service.create(dto);
    }

    /**
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig()
    @Post(Paths.MANY)
    createMany(
        @Body() dto : CreateLotsDto
    ){

        return this.service.createMany(dto.lots);

    }

    /**
     * 
     * UPDATE
     * 
     */

    /**
     * 
     * @param id 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_LOT_ID,
            to : "context.projectId",
            rule : RelationsRule.LOT_TO_PROJECT
        }
    )
    @Put(Paths.PARAM_LOT)
    update(
        @Param(Paths.PARAM_LOT_ID) id : string,
        @Body(new StripUndefinedPipe()) dto : UpdateDto
    ){
        return this.service.update(
            id,
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
     * @param id 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_LOT_ID,
            to : "contex.projectId",
            rule : RelationsRule.LOT_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_LOT)
    delete(
        @Param(Paths.PARAM_LOT_ID) id : string
    ){
        return this.service.delete(id);
    }

}