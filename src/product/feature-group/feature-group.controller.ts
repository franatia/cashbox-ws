import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { FeatureGroupService } from "./feature-group.service";
import CreateDto from "./dto/create.dto";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import { Paths } from "../constants/paths";
import GetDto from "./dto/get.dto";
import { CurrentProject } from "@/common/decorators/access/token.decorator";
import { FeatureGroupSearch } from "./feature-group.search";
import { joinPaths } from "@/common/helpers/http/path.helper";
import CreateContextDto from "./dto/create-context.dto";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";

@Controller(joinPaths(Paths.PRODUCT, Paths.FEATURE_GROUP))
@AccessPolicies(
    ProjectMainPolicie
)
export class FeatureGroupController {
    constructor(
        private readonly service : FeatureGroupService,
        private readonly search : FeatureGroupSearch
    ){}

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
            from : "productId",
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_TO_PROJECT
        },
        {
            from : "features[].id",
            to : "productId",
            rule : RelationsRule.FEATURES_TO_PRODUCT
        }
    )
    @Post()
    post(
        @Body() dto : CreateDto
    ){
        return this.service.create(dto);
    }

    /** */

    @RelationsConfig(
        {
            from : "groupId",
            to : "context.projectId",
            rule : RelationsRule.FEATURE_GROUP_TO_PROJECT
        }
    )
    @Post(Paths.CONTEXT)
    createContext(
        @Body() dto : CreateContextDto
    ){
        return this.service.createOrUpdateFeatureContext(dto);
    }

    /**
     * 
     * GET
     * 
     */

    /**
     * 
     * @param dto 
     * @param projectId 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "featureId?",
            to : "context.projectId",
            rule : RelationsRule.FEATURE_TO_PROJECT
        }
    )
    @Get()
    get(
        @Query() {featureId, ...rest} : GetDto,
        @CurrentProject() projectId : string
    ){
        return this.search.get({
            ...rest,
            ...(featureId && {featuresId : [featureId]}),
            projectId
        })
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    @Get(Paths.PARAM_FEATURE_GROUP)
    getByIds(
        @Param(Paths.PARAM_FEATURE_GROUP_ID) id : string
    ){
        return this.search.getById(id);
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
            from : Paths.PARAM_FEATURE_GROUP_ID,
            to : "context.projectId",
            rule : RelationsRule.FEATURE_GROUP_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_FEATURE_GROUP)
    delete(
        @Param(Paths.PARAM_FEATURE_GROUP_ID) id : string
    ){
        return this.service.delete(id);
    }

}