import { joinPaths } from "@/common/helpers/http/path.helper";
import { BaseController } from "@/common/models/crud/base-controller.crud";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Paths } from "../constants/paths.enum";
import TransferService from "./transfer.service";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import CreateDto from "./dto/create.dto";
import { CurrentNode, CurrentProject, CurrentSub } from "@/common/decorators/access/token.decorator";
import { TransferSearch } from "./transfer.search";
import GetDto from "./dto/get.dto";
import { AccessConfig, AccessPolicies, AtLeastNodeAccess } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";

@AccessPolicies(
    ProjectMainPolicie
)
@AccessConfig(
    AtLeastNodeAccess
)
@Controller(
    joinPaths(Paths.STOCK, Paths.TRANSFER)
)
export default class TransferController implements BaseController {

    constructor(
        private readonly service : TransferService,
        private readonly search : TransferSearch
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
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_TRANSFER_ID,
            to : "context.projectId",
            rule : RelationsRule.STOCK_TRANSFER_TO_PROJECT
        },
        {
            from : Paths.PARAM_TRANSFER_ID,
            to : "context.nodeId?",
            rule : RelationsRule.STOCK_TRANSFER_TO_NODE
        }
    )
    @Get(
        Paths.PARAM_TRANSFER
    )
    getById(
        @Param(Paths.PARAM_TRANSFER_ID) id : string
    ){
        this.search.getById(id);
    }

    /**
     * 
     * POST
     * 
     */

    /**
     * 
     * @param dto 
     * @param nodeId 
     * @param subId 
     * @param projectId 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "targetNodeId",
            to : "context.projectId",
            rule : RelationsRule.NODE_TO_PROJECT
        },
        {
            from : "items[].productItemId",
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_ITEMS_TO_PROJECT
        }
    )
    @Post()
    create(
        @Body() dto : CreateDto,
        @CurrentNode() nodeId : string,
        @CurrentSub() subId : string,
        @CurrentProject() projectId : string
    ){

        return this.service.create({
            ...dto,
            userCreatorId : subId,
            sourceNodeId : nodeId,
            projectId
        })

    }

}