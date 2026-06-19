import { BaseController } from "@/common/models/crud/base-controller.crud";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Paths } from "../constants/paths.enum";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import CreateDto from "./dto/create.dto";
import { CurrentProject } from "@/common/decorators/access/token.decorator";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import { StockService } from "./stock.service";
import { StockSearch } from "./stock.search";

@Controller(Paths.STOCK)
export default class StockController implements BaseController {

    constructor(
        private readonly service : StockService,
        private readonly search : StockSearch
    ){}
    
    /**
     * 
     * GET
     * 
     */

    /**
     * 
     * @param id 
     * @returns 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_STOCK_ID,
            to : "context.projectId",
            rule : RelationsRule.STOCK_TO_PROJECT
        }
    )
    @Get(Paths.PARAM_STOCK)
    getById(
        @Param(Paths.PARAM_STOCK_ID) id : string
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
     * @param projectId 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "productItemId",
            to : "context.project",
            rule : RelationsRule.PRODUCT_ITEM_TO_PROJECT
        }
    )
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

}