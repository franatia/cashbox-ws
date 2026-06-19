import { joinPaths } from "@/common/helpers/http/path.helper";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Paths } from "../constants/paths.enum";
import { AccessConfig, AccessPolicies, AtLeastNodeAccess } from "@/access/decorators/access.decorator";
import { ProjectAdminPolicie } from "@/access/policies/project/admin.policie";
import { NodeService } from "./node.service";
import { BaseController } from "@/common/models/crud/base-controller.crud";
import { CreateDto } from "./dto/create.dto";
import { NodeAdminPolicie } from "@/access/policies/node/admin.policie";
import { UpdateDto } from "./dto/update.dto";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import { CurrentNode, CurrentProject } from "@/common/decorators/access/token.decorator";
import { NodeSearch } from "./node.search";
import { ProjectLitePolicie } from "@/access/policies/project/lite.policie";
import { NodeLitePolicie } from "@/access/policies/node/lite.policie";
import GetDto from "./dto/get.dto";


@Controller(joinPaths(
    Paths.PROJECT,
    Paths.NODE
))
export class NodeController implements BaseController {

    constructor(
        private readonly service: NodeService,

        private readonly search : NodeSearch
    ) { }

    /**
     * 
     * GET
     * 
     */

    /**
     * 
     * @param dto 
     * @returns 
     */

    @Get()
    get(
        @Query() dto : GetDto
    ){

        return this.search.get(dto)

    }

    /**
     * 
     * @param dto 
     * @param projectId 
     * @returns 
     */

    @AccessPolicies(
        ProjectLitePolicie
    )
    @AccessConfig(
        AtLeastNodeAccess
    )
    @Get(Paths.BY_TOKEN_PROJECT)
    getByTokenProject(
        @Query() dto : GetDto,
        @CurrentProject() projectId : string,
    ){

        return this.search.get({
            ...dto,
            projectId
        })

    }

    /**
     * 
     * @param id 
     * @returns 
     */
    
    @AccessPolicies(
        NodeLitePolicie
    )
    @Get(Paths.BY_TOKEN)
    getByToken(
        @CurrentNode() id : string
    ){

        return this.search.getById(id);

    }

    /**
     * 
     * @param id 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_NODE_ID,
            to : "context.projectId",
            rule : RelationsRule.NODE_TO_PROJECT
        }
    )
    @Get(Paths.PARAM_NODE)
    getById(
        @Param(Paths.PARAM_NODE_ID) id : string
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

    @AccessPolicies(
        ProjectAdminPolicie
    )
    @Post()
    create(
        @Body() dto: CreateDto
    ) {
        return this.service.create(
            dto
        )
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
            from: Paths.PARAM_NODE_ID,
            to: "context.projectId",
            rule: RelationsRule.NODE_TO_PROJECT
        }
    )
    @AccessPolicies(
        ProjectAdminPolicie
    )
    @Put(
        Paths.PARAM_NODE
    )
    putById(
        @Param(
            Paths.PARAM_NODE_ID
        ) id: string,
        @Body() dto: UpdateDto
    ) {
        return this.service.update(
            id,
            dto
        )
    }

    /**
     * 
     * @param id 
     * @param dto 
     * @returns 
     */

    @AccessPolicies(
        NodeAdminPolicie
    )
    @Put()
    putByTokenNode(
        @CurrentNode() id : string,
        @Body() dto : UpdateDto
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

    @AccessPolicies(
        ProjectAdminPolicie
    )
    @Delete(
        Paths.PARAM_NODE
    )
    delete(
        @Param(Paths.PARAM_NODE_ID) id : string
    ){
        return this.service.delete(
            id
        );
    }

}