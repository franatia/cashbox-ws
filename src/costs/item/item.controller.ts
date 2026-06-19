import { BaseController } from "@/common/models/crud/base-controller.crud";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ItemService } from "./item.service";
import { joinPaths } from "@/common/helpers/http/path.helper";
import { Paths } from "../constants/paths.enum";
import CreateDto from "./dto/create.dto";
import { CurrentProject } from "@/common/decorators/access/token.decorator";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import UpdateDto from "./dto/update.dto";
import GetDto from "./dto/get.dto";
import ItemSearch from "./item.search";
import { SearchParams } from "./types/params/search.types";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
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
@Controller(joinPaths(Paths.COSTS, Paths.ITEM))
export class ItemController implements BaseController {

    constructor(
        private readonly service: ItemService,
        private readonly search : ItemSearch
    ) { }

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
            from: "costId",
            to: "context.projectId",
            rule: RelationsRule.COST_TO_PROJECT
        },
        {
            from: "ruleId?",
            to: "costId",
            rule: RelationsRule.COST_RULE_TO_COST
        },
        {
            from: "constantId?",
            to: "context.projectId",
            rule: RelationsRule.COST_CONSTANT_TO_PROJECT
        },
        {
            from: "taxId?",
            to: "context.projectId",
            rule: RelationsRule.TAX_TO_PROJECT
        }
    )
    @Get()
    get(
        @Query(new StripUndefinedPipe()) dto: GetDto,
        @CurrentProject() projectId: string
    ) {

        const {
            ruleId,
            ...rest
        } = dto;

        const params : SearchParams = {
            projectId,
            ...rest
        }

        if(ruleId){
            params.rulesId = [ruleId];
        }

        return this.search.get(params);
     }

     /**
      * 
      * @param id
      * @returns 
      */

     @RelationsConfig(
        {
            from : Paths.PARAM_ITEM_ID,
            to : "context.projectId",
            rule : RelationsRule.COST_ITEM_TO_PROJECT
        }
     )
     @Get(Paths.PARAM_ITEM)
     getById(
        @Param(Paths.PARAM_ITEM_ID) id : string
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

    @RelationsConfig(
        {
            from: "costId",
            to: "context.projectId",
            rule: RelationsRule.COST_TO_PROJECT
        },
        {
            from: "constantId?",
            to: "context.projectId",
            rule: RelationsRule.COST_CONSTANT_TO_PROJECT
        },
        {
            from: "taxId?",
            to: "context.projectId",
            rule: RelationsRule.TAX_TO_PROJECT
        },
        {
            from : "rulesId[]?",
            to : "costId",
            rule : RelationsRule.COST_RULES_TO_COST
        }
    )
    @Post()
    create(
        @Body() dto: CreateDto
    ) {
        return this.service.create(dto)
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
            from: Paths.PARAM_ITEM_ID,
            to: "context.projectId",
            rule: RelationsRule.COST_ITEM_TO_PROJECT
        }
    )
    @Put(Paths.PARAM_ITEM)
    put(
        @Param(Paths.PARAM_ITEM_ID) id: string,
        @Body() dto: UpdateDto
    ) {
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
            from: Paths.PARAM_ITEM_ID,
            to: "context.projectId",
            rule: RelationsRule.COST_ITEM_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_ITEM)
    delete(
        @Param(Paths.PARAM_ITEM_ID) id: string
    ) {
        return this.service.delete(id);
    }

}