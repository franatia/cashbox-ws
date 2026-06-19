import { BaseUpdater } from "@/common/models/crud/query/base-updater.crud";
import { CollaboratorQuery } from "./collaborator.query";
import { UpdateParams } from "../types/params/query.param";
import { Injectable } from "@nestjs/common";
import { Collaborator } from "@/project/entities/collaborator.entity";

@Injectable()
export class CollaboratorUpdater extends BaseUpdater<
    Collaborator,
    UpdateParams,
    CollaboratorQuery
> {

    constructor(
        query : CollaboratorQuery
    ){
        super(query);
    }

}