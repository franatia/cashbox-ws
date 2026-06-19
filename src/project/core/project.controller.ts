import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Paths } from "../constants/paths.enum";
import { ProjectService } from "./project.service";
import { ProjectSearch } from "./project.search";
import { GetDto } from "./dto/get.dto";
import { CurrentProject } from "@/common/decorators/access/token.decorator";
import { BaseController } from "@/common/models/crud/base-controller.crud";
import { CreateDto } from "./dto/create.dto";
import { UpdateDto } from "./dto/update.dto";
import { AccessPolicies } from "@/access/decorators/access.decorator";
import { ProjectAdminPolicie } from "@/access/policies/project/admin.policie";

@Controller(
    Paths.PROJECT
)
export class ProjectController implements BaseController {

    constructor(
        private readonly service : ProjectService,
        private readonly search : ProjectSearch
    ){}

    /**
     * 
     * @param dto 
     * @returns 
     */

    @Get()
    get(
        @Query() dto : GetDto
    ){
        return this.search.get(dto);
    }
    
    /**
     * 
     * @param projectId 
     * @returns 
     */

    @Get(Paths.BY_TOKEN)
    getByToken(
        @CurrentProject() projectId : string
    ){
        return this.search.getById(projectId);
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    @Get(Paths.PARAM_PROJECT)
    getById(
        @Param(Paths.PARAM_PROJECT_ID) id : string
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

    @Post()
    create(
        @Body() dto : CreateDto
    ){

        return this.service.create(dto);

    }

    /**
     * 
     * UPDATE
     * 
     */

    /**
     * 
     * @param id 
     * @param dto 
     * @returns 
     */

    @AccessPolicies(
        ProjectAdminPolicie
    )
    @Put()
    put(
        @CurrentProject() id : string,
        @Body() dto : UpdateDto
    ){
        return this.service.update(
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

    @AccessPolicies(
        ProjectAdminPolicie
    )
    @Delete()
    delete(
        @CurrentProject() id : string
    ){

        return this.service.delete(
            id
        )

    }

}