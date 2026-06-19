import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { Node } from "@/project/entities/node.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrmParams } from "../types/param/query.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NodeQuery extends BaseQuery<Node> {

    constructor(
        @InjectRepository(Node)
        repo : Repository<Node>
    ){
        super(
            Node,
            repo
        );
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    makeOrm(
        params : OrmParams
    ){

        this.notEmptyParams(params);

        const {
            projectId,
            ...rest
        } = params;

        const orm : DeepPartial<Node> = {
            ...rest
        };

        if(projectId){
            orm.project = {
                id : projectId
            }
        };

        return orm;

    }

}