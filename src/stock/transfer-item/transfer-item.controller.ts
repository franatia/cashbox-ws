import { joinPaths } from "@/common/helpers/http/path.helper";
import { BaseController } from "@/common/models/crud/base-controller.crud";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { Paths } from "../constants/paths.enum";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import { TransferItemSearch } from "./transfer-item.search";
import GetDto from "./dto/get.dto";
import { CurrentNode, CurrentProject } from "@/common/decorators/access/token.decorator";
import { AccessConfig, AccessPolicies, AtLeastNodeAccess } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";

@AccessPolicies(
    ProjectMainPolicie
)
@AccessConfig(
    AtLeastNodeAccess
)
@Controller(
    joinPaths(
        Paths.TRANSFER,
        Paths.ITEM
    )
)
export class TransferItemController implements BaseController {

    constructor(
        private readonly search: TransferItemSearch
    ) { }

    @RelationsConfig(
        {
            from: "transferId?",
            to: "context.projectId",
            rule: RelationsRule.STOCK_TRANSFER_TO_PROJECT
        },
        {
            from: "productItemId?",
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEM_TO_PROJECT
        }
    )
    @Get()
    get(
        @Query() dto: GetDto,
        @CurrentProject() projectId: string,
        @CurrentNode({optional : true}) nodeId ?: string,
    ) {
        return this.search.get(
            {
                ...dto,
                projectId,
                nodeId
            }
        )
    }

    @RelationsConfig(
        {
            from: Paths.PARAM_ITEM_ID,
            to: "context.projectId",
            rule: RelationsRule.STOCK_TRANSFER_ITEM_TO_PROJECT
        },
        {
            from: Paths.PARAM_ITEM_ID,
            to: "context.nodeId?",
            rule: RelationsRule.STOCK_TRANSFER_ITEM_TO_NODE
        }
    )
    @Get(
        Paths.PARAM_ITEM
    )
    getById(
        @Param(Paths.PARAM_ITEM_ID) id: string
    ) {
        return this.search.getById(id);
    }

}