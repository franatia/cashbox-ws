import { Injectable } from "@nestjs/common";
import { UpdateParams } from "../types/params/query.param";
import { ProjectQuery } from "./project.query";
import { BaseUpdater } from "@/common/models/crud/query/base-updater.crud";
import { Project } from "@/project/entities/project.entity";

@Injectable()
export class ProjectUpdater extends BaseUpdater<
    Project,
    UpdateParams,
    ProjectQuery
> {

    constructor(
        query : ProjectQuery
    ){
        super(query);
    }

}