import { joinPaths } from "@/common/helpers/http/path.helper";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Paths } from "../constants/paths.enum";
import { RuleService } from "./rule.service";
import CreateDto from "./dto/create.dto";
import UpdateDto from "./dto/update.dto";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import GetDto from "./dto/get.dto";
import { RuleSearch } from "./rule.search";
import GetOneDto from "./dto/get-one.dto";
import { CurrentProject } from "@/common/decorators/access/token.decorator";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import { ApiExtraModels } from "@nestjs/swagger";

@ApiExtraModels(
    GetDto,
    GetOneDto,
    CreateDto,
    UpdateDto
)
@AccessPolicies(
    ProjectMainPolicie
)
@Controller(joinPaths(Paths.COSTS, Paths.RULE))
export class RuleController {

    constructor(
        private readonly service : RuleService,
        private readonly search : RuleSearch
    ){}

    /**
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "costId?",
            to : "context.projectId",
            rule : RelationsRule.COST_TO_PROJECT
        },
        {
            from : "itemId?",
            to : "context.projectId",
            rule : RelationsRule.COST_ITEM_TO_PROJECT
        },
        {
            from : "parentId?",
            to : "context.projectId",
            rule : RelationsRule.COST_RULE_TO_PROJECT
        },
        {
            from : "childId?",
            to : "context.projectId",
            rule : RelationsRule.COST_RULE_TO_PROJECT
        }
    )
    @Get()
    get(
        @Query(new StripUndefinedPipe) dto : GetDto,
        @CurrentProject() projectId : string
    ){
        return this.search.get({
            ...dto,
            projectId
        });
    }
    
    /**
     * 
     * @param id 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_RULE_ID,
            to : "context.projectId",
            rule : RelationsRule.COST_RULE_TO_PROJECT
        }
    )
    @Get(Paths.PARAM_RULE)
    getById(
        @Param(Paths.PARAM_RULE_ID) id : string,
        @Query() dto : GetOneDto
    ){
        const {
            itemsSkip,
            itemsTake
        } = dto;

        return this.search.get({
            id,
            itemsSkip,
            itemsTake,
            skip : 0,
            take : 1
        })
    }

    /**
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "costId",
            to : "context.projectId",
            rule : RelationsRule.COST_TO_PROJECT
        }
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
            from : Paths.PARAM_RULE_ID,
            to : "context.project",
            rule : RelationsRule.COST_RULE_TO_PROJECT
        },
        {
            from : Paths.PARAM_RULE_ID,
            to : "parentsId[]?",
            rule : RelationsRule.COST_RULE_RELATED_TO_COST_RULES
        },
        {
            from : Paths.PARAM_RULE_ID,
            to : "itemsId[]?",
            rule : RelationsRule.COST_RULE_RELATED_TO_COST_ITEMS
        }
    )
    @Put(Paths.PARAM_RULE)
    put(
        @Param(Paths.PARAM_RULE_ID) id : string,
        @Body() dto : UpdateDto
    ){
        return this.service.put(
            id,
            dto
        )
    }
    
    /**
     * 
     * @param id 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_RULE_ID,
            to : "context.project",
            rule : RelationsRule.COST_RULE_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_RULE)
    delete(
        @Param(Paths.PARAM_RULE_ID) id : string
    ){
        return this.service.delete(
            id
        )
    }

}