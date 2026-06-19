import { BaseInitializer } from "@/common/models/crud/base-initializer.crud";
import { Injectable } from "@nestjs/common";
import { ProjectSaver } from "./query/project.saver";
import { AuthContext } from "@/auth/auth.context";
import TaxProfileService from "@/tax/tax-profile/tax-profile.service";
import { Project } from "../entities/project.entity";
import { ProjectQuery } from "./query/project.query";
import { SaveParams } from "./types/params/query.param";
import { CreateParams } from "./types/params/service.param";

@Injectable()
export class ProjectInitializer extends BaseInitializer<
    Project,
    SaveParams,
    ProjectQuery,
    ProjectSaver
> {

    constructor(
        saver : ProjectSaver,
        authContext : AuthContext,

        private readonly taxProfileService : TaxProfileService
    ){

        super(saver, authContext);

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    initialize(
        params: CreateParams
    ): Promise<Project> {
        
        return super.initialize({
            ...params,
            ownerId : this.userClientId
        })

    }

    /**
     * 
     * @param id 
     */

    async createLinkedEntities(
        entity : Project
    ){

        const {
            id
        } = entity;

        await this.taxProfileService.create({
            projectId : id
        })

    }

}