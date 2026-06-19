import { BaseController } from "@/common/models/crud/base-controller.crud";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import ConstantService from "./constant.service";
import ConstantSearch from "./constant.search";
import { joinPaths } from "@/common/helpers/http/path.helper";
import { Paths } from "../constants/paths.enum";
import CreateDto from "./dto/create.dto";
import { CurrentProject } from "@/common/decorators/access/token.decorator";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import GetDto from "./dto/get.dto";
import UpdateDto from "./dto/update.dto";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import { ApiExtraModels } from "@nestjs/swagger";

@ApiExtraModels(
    GetDto,
    CreateDto,
    UpdateDto
)
@AccessPolicies(
    ProjectMainPolicie
)
@Controller(joinPaths(Paths.COSTS, Paths.CONSTANT))
export default class ConstantController implements BaseController {
    
    constructor(
        private readonly service : ConstantService,
        private readonly search : ConstantSearch
    ){}

    /**
     * 
     * GETTERS
     * 
     */

    /**
     * 
     * @param dto 
     * @param projectId 
     * @returns 
     */

    @Get()
    get(
        @Query(new StripUndefinedPipe()) dto : GetDto,
        @CurrentProject() projectId : string,
    ){
        return this.search.get({
            projectId,
            ...dto
        })
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_CONSTANT_ID,
            to : "context.projectId",
            rule : RelationsRule.COST_CONSTANT_TO_PROJECT
        }
    )
    @Get(Paths.PARAM_CONSTANT)
    getById(
        @Param(Paths.PARAM_CONSTANT_ID) id : string
    ){
        return this.search.getById(id);
    }
    
    /**
     * 
     * CREATORS
     * 
     */

    /**
     * 
     * @param dto 
     * @param projectId 
     * @returns 
     */

    @Post()
    create(
        @Body() dto : CreateDto,
        @CurrentProject() projectId : string
    ){
        return this.service.create({
            projectId,
            ...dto
        })
    }

    /**
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
            from : Paths.PARAM_CONSTANT_ID,
            to : "context.projectId",
            rule : RelationsRule.COST_CONSTANT_TO_PROJECT
        }
    )
    @Put(
        Paths.PARAM_CONSTANT
    )
    put(
        @Param(Paths.PARAM_CONSTANT_ID) id : string,
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

    /**
     * 
     * @param id 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_CONSTANT_ID,
            to : "context.projectId",
            rule : RelationsRule.COST_CONSTANT_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_CONSTANT)
    delete(
        @Param(Paths.PARAM_CONSTANT_ID) id : string
    ){
        return this.service.delete(id);
    }
}