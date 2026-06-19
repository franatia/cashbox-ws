import { BaseDeleter } from "@/common/models/crud/query/base-deleter.crud";
import { CollaboratorQuery } from "./collaborator.query";
import { OrmParams } from "../types/params/query.param";
import { Collaborator } from "@/project/entities/collaborator.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CollaboratorDeleter extends BaseDeleter<
    Collaborator,
    OrmParams,
    CollaboratorQuery
> {

    constructor(
        query : CollaboratorQuery
    ){
        super(query);
    }
    
}