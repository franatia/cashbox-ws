import { BaseController } from "@/common/models/crud/base-controller.crud";
import { MovementsLinkerSearch } from "./movements-linker.search";
import { Controller, Get, Param, Query } from "@nestjs/common";
import GetDto from "./dto/get.dto";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import { CurrentNode, CurrentProject } from "@/common/decorators/access/token.decorator";
import { Paths } from "../constants/paths.enum";
import { AccessConfig, AccessPolicies, AtLeastNodeAccess } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";

@AccessPolicies(
    ProjectMainPolicie
)
@AccessConfig(
    AtLeastNodeAccess
)
@Controller(
    Paths.MOVEMENTS_LINKER
)
export class MovementsLinkerController implements BaseController {

    constructor(
        private readonly search : MovementsLinkerSearch
    ){}

    @RelationsConfig(
        {
            from : "transferItemId?",
            to : "context.projectId",
            rule : RelationsRule.STOCK_TRANSFER_TO_PROJECT
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

    @RelationsConfig(
        {
            from : Paths.PARAM_MOVEMENTS_LINKER_ID,
            to : "context.projectId",
            rule : RelationsRule.STOCK_MOVEMENTS_LINKER_TO_PROJECT
        },
        {
            from : Paths.PARAM_MOVEMENTS_LINKER_ID,
            to : "context.nodeId?",
            rule : RelationsRule.STOCK_MOVEMENTS_LINKER_TO_NODE
        }
    )
    @Get(
        Paths.PARAM_MOVEMENTS_LINKER
    )
    getById(
        @Param(Paths.PARAM_MOVEMENTS_LINKER_ID) id : string
    ){}

}