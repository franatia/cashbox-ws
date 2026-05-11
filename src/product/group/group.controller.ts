import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import CreateDto from "./dto/create.dto";
import { GroupService } from "./group.service";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import { CurrentProject } from "@/common/decorators/token.decorator";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import UpdateDto from "./dto/update.dto";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import { Paths } from "../constants/paths";
import { joinPaths } from "@/common/helpers/path.helper";
import GetDto from "./dto/get.dto";
import GroupSearch from "./group.search";

@Controller(joinPaths(Paths.PRODUCT, Paths.GROUP))
@AccessPolicies(
    ProjectMainPolicie
)
export default class GroupController {
    
    constructor(
        private readonly service : GroupService,
        private readonly search  : GroupSearch
    ){}

    /**
     * 
     * GET
     * 
     */

    @RelationsConfig(
        {
            from : "productId?",
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_TO_PROJECT
        },
        {
            from : "parentGroupId?",
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_GROUP_TO_PROJECT
        }
    )
    @Get()
    get(
        @Query(new StripUndefinedPipe()) dto : GetDto,
        @CurrentProject() projectId : string
    ){
        return this.search.get({
            ...dto,
            projectId
        });
    }

    @RelationsConfig(
        {
            from : Paths.PARAM_GROUP_ID,
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_GROUP_TO_PROJECT
        }
    )
    @Get(Paths.PARAM_GROUP)
    getById(
        @Param(Paths.PARAM_GROUP_ID) id : string
    ){
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
     * @param dto 
     */

    @RelationsConfig(
        {
            from : "productsId[]",
            to : "context.projectId",
            rule : RelationsRule.PRODUCTS_TO_PROJECT
        },
        {
            from : "parentGroupId?",
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_GROUP_TO_PROJECT
        }
    )
    @Post()
    async create(
        @Body() dto : CreateDto,
        @CurrentProject() projectId : string
    ){
        return this.service.create(projectId, dto);
    }

    /**
     * 
     * 
     * PUT
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
            from : "productsId[]?",
            to : "context.projectId",
            rule: RelationsRule.PRODUCTS_TO_PROJECT
        }
    )
    @Put(Paths.PARAM_GROUP)
    put(
        @Param(Paths.PARAM_GROUP_ID) id : string,
        @Body(new StripUndefinedPipe()) dto : UpdateDto,
    ){
        return this.service.put(
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
            from : Paths.PARAM_GROUP_ID,
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_GROUP_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_GROUP)
    delete(
        @Param(Paths.PARAM_GROUP_ID) id : string
    ){
        return this.service.delete(id);
    }

}