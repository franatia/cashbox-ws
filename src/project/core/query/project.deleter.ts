import { BaseDeleter } from "@/common/models/crud/query/base-deleter.crud";
import { ProjectQuery } from "./project.query";
import { Injectable } from "@nestjs/common";
import { Project } from "@/project/entities/project.entity";
import { OrmParams } from "../types/params/query.param";

@Injectable()
export class ProjectDeleter extends BaseDeleter<
    Project,
    OrmParams,
    ProjectQuery
> {

    constructor(
        query : ProjectQuery
    ){
        super(query);
    }

}