import {BaseService} from "@/common/models/crud/base-service.crud";
import { CreateParams, UpdateParams } from "./types/params/service.param";
import { Injectable } from "@nestjs/common";
import { CollaboratorInitializer } from "./collaborator.initializer";
import { CollaboratorUpdater } from "./query/collaborator.updater";
import { CollaboratorDeleter } from "./query/collaborator.deleter";

@Injectable()
export class CollaboratorService implements BaseService {

    constructor(
        private readonly initializer : CollaboratorInitializer,
        private readonly updater : CollaboratorUpdater,
        private readonly deleter : CollaboratorDeleter
    ){}
    
    /**
     * 
     * @param params 
     * @returns 
     */

    create(
        params : CreateParams
    ){

        return this.initializer.initialize(
            params
        );

    }

    /**
     * 
     * UPDATERS
     * 
     */

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    update(
        id : string,
        params : UpdateParams
    ){

        return this.updater.updateById(
            id,
            params
        )

    }

    /**
     * 
     * @param id 
     * @returns 
     */

    delete(
        id : string
    ){

        return this.deleter.deleteById(id);

    }

}