import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import ComposityService from "./composity.service";
import CompositySearch from "./composity.search";
import { RelationsConfig, RelationsRule } from "@/relations/decorators/relations.decorator";
import CreateDto from "./dto/create.dto";
import CreateManyDto from "./dto/create-many.dto";
import { Paths } from "../constants/paths";
import UpdateDto from "./dto/update.dto";
import GetDto from "./dto/get.dto";
import { StripUndefinedPipe } from "@/common/pipes/stripe-undefined.pipe";
import { joinPaths } from "@/common/helpers/path.helper";

@Controller(joinPaths(Paths.PRODUCT, Paths.COMPOSITY))
export default class ComposityController {
    constructor(
        private readonly service: ComposityService,
        private readonly search: CompositySearch
    ) { }


    /**
     * 
     * GET
     * 
     */

    /**
     * 
     * @param dto 
     */
    @Get()
    async get(
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
            from: "productId",
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_TO_PROJECT
        },
        {
            from: "items[].id",
            to: "productId",
            rule: RelationsRule.PRODUCT_ITEMS_NOT_LINKED_TO_PRODUCT
        },
        {
            from: "items[].id",
            to: "context.projectId",
            rule: RelationsRule.PRODUCT_ITEMS_TO_PROJECT
        },
        {
            from : "productId",
            to : "items[].id",
            rule: RelationsRule.PRODUCT_HAS_NOT_COMPOSITY_ITEMS
        }
    )
    @Post()
    create(
        @Body() dto: CreateManyDto
    ) {
        return this.service.createMany(dto);
    }

    /**
     * 
     * PUT
     * 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_COMPOSITY_ID,
            to : "context.projectId",
            rule : RelationsRule.COMPOSITY_TO_PROJECT
        }
    )
    @Put(Paths.PARAM_COMPOSITY)
    put(
        @Param(Paths.PARAM_COMPOSITY_ID) id : string,
        @Body(new StripUndefinedPipe()) dto : UpdateDto
    ){
        return this.put(id, dto);
    }

    /**
     * 
     * DELETE
     * 
     */

    @RelationsConfig(
        {
            from : Paths.PARAM_COMPOSITY_ID,
            to : "context.projectId",
            rule : RelationsRule.COMPOSITY_TO_PROJECT
        }
    )
    @Delete(Paths.PARAM_COMPOSITY)
    delete(
        @Param(Paths.PARAM_COMPOSITY_ID) id : string
    ){
        return this.service.delete(id);
    }


}