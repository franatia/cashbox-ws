import { BaseInitializer } from "@/common/models/crud/base-initializer.crud";
import { CreateParams } from "./types/params/service.param";
import { AuthContext } from "@/auth/auth.context";
import { CollaboratorSaver } from "./query/collaborator.saver";
import { CollaboratorValidator } from "./collaborator.validator";
import { Collaborator } from "../entities/collaborator.entity";
import { CollaboratorQuery } from "./query/collaborator.query";
import { SaveParams } from "./types/params/query.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CollaboratorInitializer extends BaseInitializer<
    Collaborator,
    SaveParams,
    CollaboratorQuery,
    CollaboratorSaver
> {

    constructor(
        authContext : AuthContext,
        saver : CollaboratorSaver,

        private readonly validator : CollaboratorValidator
    ) {
        super(
            saver,
            authContext
        )
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    async initialize(
        params: CreateParams
    ) {

        const {
            userId,
            nodeId
        } = params;

        await this.validator.ensureCanCreate({
            userId,
            projectId : this.userProjectId,
            nodeId : this.optionalUserNodeId ?? nodeId,
            clientId : this.userClientId
        });

        return super.initialize({
            ...params,
            projectId : this.userProjectId,
            nodeId : this.optionalUserNodeId ?? nodeId
        });

    }

}