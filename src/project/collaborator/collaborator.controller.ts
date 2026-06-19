import { joinPaths } from "@/common/helpers/http/path.helper";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Paths } from "../constants/paths.enum";
import { CollaboratorService } from "./collaborator.service";
import { BaseController } from "@/common/models/crud/base-controller.crud";
import { CreateDto } from "./dto/create.dto";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import { UpdateDto } from "./dto/update.dto";
import { AccessConfig, AccessPolicies, AtLeastNodeAccess, FirstMatchAccess } from "@/access/decorators/access.decorator";
import { CollaboratorSearch } from "./collaborator.search";
import { GetDto } from "./dto/get.dto";
import { CurrentNode, CurrentProject, CurrentSub } from "@/common/decorators/access/token.decorator";
import BaseGetDto from "@/common/models/dto/base-get.dto";
import { ProjectLitePolicie } from "@/access/policies/project/lite.policie";
import { ProjectAdminPolicie } from "@/access/policies/project/admin.policie";
import { NodeAdminPolicie } from "@/access/policies/node/admin.policie";

@Controller(
    joinPaths(
        Paths.PROJECT,
        Paths.COLLABORATOR
    )
)
export class CollaboratorController implements BaseController {

    constructor(
        private readonly service : CollaboratorService,
        private readonly search : CollaboratorSearch
    ){}

    /**
     * 
     * @param dto 
     * @param projectId 
     * @param nodeId 
     * @returns 
     */

    @AccessPolicies(
        ProjectLitePolicie
    )
    @AccessConfig(
        AtLeastNodeAccess
    )
    @Get()
    get(
        @Query() dto : GetDto,
        @CurrentProject() projectId : string,
        @CurrentNode({optional : true}) nodeId ?: string
    )
    {
        return this.search.get({
            ...dto,
            projectId,
            nodeId
        });

    }

    /**
     * 
     * @param clientId 
     * @param projectId 
     * @param dto 
     * @returns 
     */

    @AccessPolicies(
       ProjectLitePolicie 
    )
    @AccessConfig(
        AtLeastNodeAccess
    )
    @Get(
        Paths.BY_TOKEN_CLIENT
    )
    getByTokenClient(
        @CurrentSub() clientId : string,
        @CurrentProject() projectId : string,
        @Query() dto : BaseGetDto
    ){
        return this.search.get({
            ...dto,
            userId : clientId,
            projectId
        })
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_COLLABORATOR_ID,
            to : "context.projectId",
            rule : RelationsRule.COLLABORATOR_TO_PROJECT
        },
        {
            from : Paths.PARAM_COLLABORATOR_ID,
            to : "context.nodeId?",
            rule : RelationsRule.COLLABORATOR_TO_NODE
        }
    )
    @AccessPolicies(
       ProjectLitePolicie 
    )
    @AccessConfig(
        AtLeastNodeAccess
    )
    @Get(
        Paths.PARAM_COLLABORATOR_ID
    )
    getById(
        @Param(Paths.PARAM_COLLABORATOR_ID) id : string
    ){
        return this.search.getById(id);
    }

    /**
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "nodeId?",
            to : "context.projectId",
            rule : RelationsRule.NODE_TO_PROJECT
        }
    )
    @AccessPolicies(
        ProjectAdminPolicie,
        NodeAdminPolicie
    )
    @AccessConfig(
        FirstMatchAccess
    )
    @Post()
    create(
        @Body() dto : CreateDto
    ){

        return this.service.create(
            dto
        )

    }

    /**
     * 
     * @param id 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_COLLABORATOR_ID,
            to : "context.projectId",
            rule : RelationsRule.COLLABORATOR_TO_PROJECT
        },
        {
            from : Paths.PARAM_COLLABORATOR_ID,
            to : "context.nodeId?",
            rule : RelationsRule.COLLABORATOR_TO_NODE
        },
        {
            from : Paths.PARAM_COLLABORATOR_ID,
            to : "sub",
            rule : RelationsRule.COLLABORATOR_NOT_LINKED_TO_USER
        }
    )
    @AccessPolicies(
        ProjectAdminPolicie,
        NodeAdminPolicie
    )
    @AccessConfig(
        FirstMatchAccess
    )
    @Put(
        Paths.PARAM_COLLABORATOR
    )
    put(
        @Param(
            Paths.PARAM_COLLABORATOR_ID
        ) id : string,
        @Body() dto : UpdateDto
    ){
        return this.service.update(
            id,
            dto
        );
    }
    
    /**
     * 
     * @param id 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_COLLABORATOR_ID,
            to : "context.projectId",
            rule : RelationsRule.COLLABORATOR_TO_PROJECT
        },
        {
            from : Paths.PARAM_COLLABORATOR_ID,
            to : "context.nodeId?",
            rule : RelationsRule.COLLABORATOR_TO_NODE
        }
    )
    @AccessPolicies(
        ProjectAdminPolicie,
        NodeAdminPolicie
    )
    @AccessConfig(
        FirstMatchAccess
    )
    @Delete(
        Paths.PARAM_COLLABORATOR
    )
    delete(
        @Param(
            Paths.PARAM_COLLABORATOR_ID
        ) id : string
    ){
        return this.service.delete(
            id
        );
    }

}