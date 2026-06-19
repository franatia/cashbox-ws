import { BaseController } from "@/common/models/crud/base-controller.crud";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Paths } from "../constants/paths.enum";
import CostService from "./cost.service";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import CreateDto from "./dto/create.dto";
import { CurrentProject } from "@/common/decorators/access/token.decorator";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import UpdateDto from "./dto/update.dto";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import GetDto from "./dto/get.dto";
import CostSearch from "./cost.search";
import CalculateDto from "./dto/calculate.dto";
import { ApiExtraModels } from "@nestjs/swagger";

@ApiExtraModels(
    CreateDto,
    GetDto,
    CalculateDto,
    UpdateDto
)
@AccessPolicies(
    ProjectMainPolicie
)
@Controller(Paths.COSTS)
export default class CostController implements BaseController {

    constructor(
        private readonly service : CostService,
        private readonly search : CostSearch,
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
        @CurrentProject() projectId : string
    ){
        return this.search.get({
            projectId,
            ...dto
        })
    }

    @RelationsConfig(
        {
            from : Paths.PARAM_COST_ID,
            to : "context.projectId",
            rule : RelationsRule.COST_TO_PROJECT
        }
    )
    @Get(Paths.PARAM_COST)
    getById(
        @Param(Paths.PARAM_COST_ID) id : string
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
        @Body(new StripUndefinedPipe()) dto : CreateDto,
        @CurrentProject() projectId : string
    ){
        return this.service.create({
            projectId,
            ...dto
        })
    }

    /**
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "productItem.costId",
            to : "context.projectId",
            rule : RelationsRule.COST_TO_PROJECT
        },
        {
            from : "productItem.id",
            to : "productItem.costId",
            rule : RelationsRule.PRODUCT_ITEM_TO_COST
        },
        {
            from : "inputData[]?.id",
            to : "productItem.costId",
            rule : RelationsRule.COST_ITEMS_TO_COST
        }
    )
    @Post(Paths.CALCULATE)
    async calculate(
        @Body() dto : CalculateDto
    ){
        
        const {
            seed,
            ...rest
        } = await this.service.calculate(dto)
    
        return rest;

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
            from : Paths.PARAM_COST_ID,
            to : "context.projectId",
            rule : RelationsRule.COST_TO_PROJECT
        }
    )
    @Put(Paths.PARAM_COST)
    put(
        @Param(Paths.PARAM_COST_ID) id : string,
        @Body(new StripUndefinedPipe()) dto : UpdateDto
    ){
        return this.service.put(
            id,
            dto
        )
    }

    /**
     * 
     * DELETERS
     * 
     */

    /**
     * 
     * @param id 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_COST_ID,
            to : "context.projectId",
            rule : RelationsRule.COST_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_COST)
    delete(
        @Param(Paths.PARAM_COST_ID) id : string
    ){
        return this.service.delete(id);
    }

}