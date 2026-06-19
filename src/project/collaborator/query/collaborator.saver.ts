import { BaseSaver } from "@/common/models/crud/query/base-saver.crud";
import { CollaboratorQuery } from "./collaborator.query";
import { SaveParams } from "../types/params/query.param";
import { Injectable } from "@nestjs/common";
import { Collaborator } from "@/project/entities/collaborator.entity";

@Injectable()
export class CollaboratorSaver extends BaseSaver<
    Collaborator,
    SaveParams,
    CollaboratorQuery
> {

    constructor(
        query : CollaboratorQuery
    ){
        super(query);
    }

}