import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { Project } from "@/project/entities/project.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrmParams } from "../types/params/query.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectQuery extends BaseQuery<Project>{

    constructor(
        @InjectRepository(Project)
        repo : Repository<Project>
    ){
        super(
            Project,
            repo
        )
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    makeOrm(params: OrmParams): DeepPartial<Project> {

        this.notEmptyParams(params);
        
        const {
            ownerId,
            ...rest
        } = params;

        const orm : DeepPartial<Project> = {
            ...rest
        };

        if(ownerId){
            orm.owner = {
                id : ownerId
            }
        }

        return orm;

    }

}