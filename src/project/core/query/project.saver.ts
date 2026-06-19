import { SaveParams } from "../types/params/query.param";
import { Injectable } from "@nestjs/common";
import { ProjectQuery } from "./project.query";
import { BaseSaver } from "@/common/models/crud/query/base-saver.crud";
import { Project } from "@/project/entities/project.entity";

@Injectable()
export class ProjectSaver extends BaseSaver<
    Project,
    SaveParams,
    ProjectQuery
> {

    constructor(
        query : ProjectQuery
    ){
        super(
            query
        );
    }

}