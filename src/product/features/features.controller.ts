import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from "@nestjs/common";
import { FeaturesService } from "./features.service";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import { joinPaths } from "@/common/helpers/http/path.helper";
import { Paths } from "../constants/paths";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import { CreateFeaturesDto } from "./dto/create-features.dto";
import UpdateDto from "./dto/update.dto";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import FeatureSearch from "./features.search";
import GetDto from "./dto/get.dto";

@Controller(joinPaths(Paths.PRODUCT, Paths.FEATURES))
@AccessPolicies(
    ProjectMainPolicie
)
export class FeaturesController {
    
    constructor(
        private readonly service : FeaturesService,
        private readonly search : FeatureSearch
    ){ }

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
        }
    )
    @Get()
    get(
        @Query(new StripUndefinedPipe()) dto : GetDto
    ){
        return this.search.get(dto);
    }

    @RelationsConfig(
        {
            from : Paths.PARAM_FEATURE_ID,
            to : "context.projectId",
            rule : RelationsRule.FEATURE_TO_PROJECT
        }
    )
    @Get(Paths.PARAM_FEATURE)
    getById(
        @Param(Paths.PARAM_FEATURE_ID) id : string
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
     * @returns 
     */

    @RelationsConfig(
        {
            from : "productId",
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_TO_PROJECT
        }
    )
    @Post()
    post(
        @Body(new StripUndefinedPipe()) dto : CreateFeaturesDto
    ){
        return this.service.create(dto);
    }

    /**
     * 
     * PUT
     * 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_FEATURE_ID,
            to : "context.projectId",
            rule : RelationsRule.FEATURE_TO_PROJECT
        }
    )
    @Put(Paths.PARAM_FEATURE)
    put(
        @Param(Paths.PARAM_FEATURE_ID, new ParseUUIDPipe()) id : string,
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
            from : Paths.PARAM_FEATURE_ID,
            to : "context.projectId",
            rule : RelationsRule.FEATURE_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_FEATURE)
    delete(
        @Param(Paths.PARAM_FEATURE_ID, new ParseUUIDPipe()) id : string
    ){
        return this.service.delete(id);
    }

}