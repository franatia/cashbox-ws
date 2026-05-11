import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ComplementService } from "./complement.service";
import { joinPaths } from "@/common/helpers/path.helper";
import { Paths } from "../constants/paths";
import { CreateDto } from "./dto/create.dto";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import UpdateDto from "./dto/update.dto";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { ProjectMainPolicie } from "@/access/policies/project/main.policie";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import { CreateItemsDto } from "./dto/create-items.dto";
import { VerifyComplementItemsGuard } from "./guards/complement.guard";
import { ComplementSearch } from "./complement.search";
import GetDto from "./dto/get.dto";
import GetItemsDto from "./dto/get-items.dto";
import { ComplementItemSearch } from "./complement-item.search";

@Controller(joinPaths(Paths.PRODUCT, Paths.COMPLEMENT))
@AccessPolicies(
    ProjectMainPolicie
)
export default class ComplementController {
    constructor(
        private readonly service: ComplementService,
        private readonly search : ComplementSearch,
        private readonly itemSearch : ComplementItemSearch
    ) { }

    /**
     * 
     * GET
     * 
     */

    /**
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig({
        from : "productId",
        to : "context.projectId",
        rule : RelationsRule.PRODUCT_TO_PROJECT
    })
    @Get()
    get(
        @Query(new StripUndefinedPipe()) dto : GetDto
    ){
        return this.search.get(dto);
    }

    /**
     * 
     * @param dto 
     * @returns 
     */

    @RelationsConfig(
        {
            from : "complementId?",
            to: "context.projectId",
            rule : RelationsRule.COMPLEMENT_TO_PROJECT
        },
        {
            from : "productItemId?",
            to : "context.projectId",
            rule : RelationsRule.PRODUCT_ITEM_TO_PROJECT
        }
    )
    @Get(Paths.ITEMS)
    getItems(
        @Query(new StripUndefinedPipe()) dto : GetItemsDto
    ){
        return this.itemSearch.get(dto);
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    @RelationsConfig({
        from : Paths.PARAM_COMPLEMENT_ID,
        to : "context.projectId",
        rule : RelationsRule.COMPLEMENT_TO_PROJECT
    })
    @Get(Paths.PARAM_COMPLEMENT)
    getById(
        @Param(Paths.PARAM_COMPLEMENT_ID) id : string
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

    /**
     * 
     * TODO VERIFY PRICE LIST RULE
     * 
     * @param dto 
     * @returns 
     */

    @UseGuards(VerifyComplementItemsGuard)
    @RelationsConfig(
        {
            from: "productId",
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_TO_PROJECT
        }
    )
    @Post()
    create(
        @Body(new StripUndefinedPipe()) dto: CreateDto
    ) {
        return this.service.create(dto);
    }

    /**
     * 
     * @param dto 
     */

    @UseGuards(VerifyComplementItemsGuard)
    @RelationsConfig(
        {
            from: "complementId",
            to: "context.projectId",
            rule: RelationsRule.COMPLEMENT_TO_PROJECT
        },
        {
            from: "itemsId[]",
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEMS_TO_PROJECT
        }
    )
    @Post(Paths.ITEMS)
    createItems(
        @Body(new StripUndefinedPipe()) dto: CreateItemsDto
    ) {
        return this.service.createItems(dto);
    }

    /**
     * 
     * PUT
     * 
     */

    @RelationsConfig(
        {
            from: Paths.PARAM_COMPLEMENT_ID,
            to: "context.projectId",
            rule: RelationsRule.COMPLEMENT_TO_PROJECT
        }
    )
    @Put(Paths.PARAM_COMPLEMENT)
    put(
        @Body(new StripUndefinedPipe()) dto: UpdateDto,
        @Param(Paths.PARAM_COMPLEMENT_ID) id: string
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


    @Delete(Paths.PARAM_COMPLEMENT)
    delete(
        @Param(Paths.PARAM_COMPLEMENT_ID) id: string
    ) {
        return this.service.delete(id);
    }

    @Delete(joinPaths(Paths.ITEMS, Paths.PARAM_COMPLEMENT_ITEM_ID))
    deleteItem(
        @Param(Paths.PARAM_COMPLEMENT_ITEM_ID) itemId: string
    ) {
        return this.service.deleteItem(itemId);
    }

}