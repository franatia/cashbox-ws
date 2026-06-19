import { BaseController } from "@/common/models/crud/base-controller.crud";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Paths } from "../constants/paths";
import CreateDto from "./dto/create.dto";
import { CurrentProject } from "@/common/decorators/access/token.decorator";
import TaxService from "./tax.service";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import UpdateDto from "./dto/update.dto";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import TaxSearch from "./tax.search";
import GetDto from "./dto/get.dto";


@Controller(Paths.TAX)
@AccessPolicies(
    ProjectMainPolicie
)
export default class TaxController implements BaseController {

    constructor(
        private readonly service : TaxService,
        private readonly search : TaxSearch,
    ){}

    /**
     * 
     * GET
     * 
     */
    
    @Get()
    get(
        @Query(new StripUndefinedPipe()) dto : GetDto,
        @CurrentProject() projectId : string,
    ){
        return this.search.get({
            projectId,
            ...dto
        });
    }

    @RelationsConfig(
        {
            from : Paths.PARAM_TAX_ID,
            to : "context.projectId",
            rule : RelationsRule.TAX_TO_PROJECT
        }
    )
    @Get(Paths.PARAM_TAX)
    getById(
        @Param(Paths.PARAM_TAX_ID) id : string
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
     * @param projectId 
     */

    @Post()
    create(
        @Body(new StripUndefinedPipe()) dto : CreateDto,
        @CurrentProject() projectId : string
    ){

        return this.service.create({
            ...dto,
            projectId
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
            from : Paths.PARAM_TAX_ID,
            to : "context.projectId",
            rule : RelationsRule.TAX_TO_PROJECT_PROFILE
        }
    )
    @Put(
        Paths.PARAM_TAX
    )
    put(
        @Param(Paths.PARAM_TAX_ID) id : string,
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
            from : Paths.PARAM_TAX_ID,
            to : "context.projectId",
            rule : RelationsRule.TAX_TO_PROJECT_PROFILE
        }
    )
    @Delete(Paths.PARAM_TAX)
    delete(
        @Param(Paths.PARAM_TAX_ID) id : string
    ){
        return this.service.delete(id);
    }

}