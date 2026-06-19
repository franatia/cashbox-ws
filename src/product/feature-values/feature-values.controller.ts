import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { FeatureValuesService } from "./feature-values.service";
import { joinPaths } from "@/common/helpers/http/path.helper";
import { Paths } from "../constants/paths";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import { CreateDto } from "./dto/create.dto";
import UpdateDto from "./dto/update.dto";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import FeatureValuesSearch from "./feature-values.search";
import GetDto from "./dto/get.dto";

@Controller(joinPaths(Paths.PRODUCT, Paths.FEATURE_VALUES))
@AccessPolicies(
    ProjectMainPolicie
)
export default class FeatureValuesController {
    
    constructor(
        private readonly service : FeatureValuesService,
        private readonly search : FeatureValuesSearch
    ){}

    /**
     * 
     * GET
     * 
     */

    @RelationsConfig(
        {
            from : "featureId?",
            to : "context.projectId",
            rule : RelationsRule.FEATURE_TO_PROJECT
        },
        {
            from : "itemGroupId?",
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_ITEM_GROUP_TO_PROJECT
        }
    )
    @Get()
    get(
        @Query(new StripUndefinedPipe()) dto : GetDto
    ){
        return this.search.get(dto);
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
            from : "featureId",
            to : "context.projectId",
            rule : RelationsRule.FEATURE_TO_PROJECT
        }
    )
    @Post()
    post(
        @Body() dto : CreateDto
    ){
        return this.service.create(
            dto
        )
    }

    /**
     * 
     * PUT
     * 
     */
    
    @RelationsConfig(
        {
            from : Paths.PARAM_FEATURE_VALUE_ID,
            to : "context.projectId",
            rule : RelationsRule.FEATURE_VALUES_TO_PROJECT
        }
    )
    @Put(Paths.PARAM_FEATURE_VALUE)
    put(
        @Param(Paths.PARAM_FEATURE_VALUE_ID) id : string,
        @Body(new StripUndefinedPipe()) dto : UpdateDto
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

    @RelationsConfig(
        {
            from : Paths.PARAM_FEATURE_VALUE_ID,
            to : "context.projectId",
            rule : RelationsRule.FEATURE_VALUES_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_FEATURE_VALUE)
    async delete(
        @Param(Paths.PARAM_FEATURE_VALUE_ID) id : string
    ){
        return this.service.delete(id);

    }

}