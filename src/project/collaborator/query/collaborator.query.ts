import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { Collaborator } from "@/project/entities/collaborator.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrmParams } from "../types/params/query.param";

@Injectable()
export class CollaboratorQuery extends BaseQuery<Collaborator> {

    constructor(
        @InjectRepository(Collaborator)
        repo : Repository<Collaborator>
    ){
        super(
            Collaborator,
            repo
        )
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    makeOrm(
        params: OrmParams
    ): DeepPartial<Collaborator> {
        
        this.notEmptyParams(
            params
        );

        const {
            nodeId,
            projectId,
            userId,
            ...rest
        } = params;

        const orm : DeepPartial<Collaborator> = {
            ...rest
        };

        if(nodeId){
            orm.node = {
                id : nodeId
            }
        }

        if(projectId){
            orm.project = {
                id : projectId
            }
        }

        if(userId){
            orm.user = {
                id : userId
            }
        }

        return orm;

    }


}