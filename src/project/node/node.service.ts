import {BaseService} from "@/common/models/crud/base-service.crud";
import { CreateParams, UpdateParams } from "./types/param/service.param";
import { NodeInitializer } from "./node.initializer";
import { Injectable } from "@nestjs/common";
import { NodeUpdater } from "./query/node.updater";
import { NodeDeleter } from "./query/node.deleter";

@Injectable()
export class NodeService implements BaseService {

    constructor(
        private readonly initializer: NodeInitializer,

        private readonly updater: NodeUpdater,
        private readonly deleter : NodeDeleter,
    ) { }

    /**
     * 
     * CREATORS
     * 
     */

    /**
       * 
       * Crea nuevos nodos y los asigna a un proyecto.
       * 
       * IMPORTANTE: El usuario debe ser OWNER o ADMIN del proyecto para crear nodos.
       * 
       * @param createNodesDto 
       * @param user 
       * @returns 
       */

    async create(
        params: CreateParams
    ) {

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
       * Actualiza un nodo existente.
       * 
       * IMPORTANTE: Solo el propietario (owner) o un colaborador con rol ADMIN pueden actualizar un nodo.
       * 
       * @param id 
       * @param updateNodeDto 
       * @param user 
       */

    async update(
        id: string,
        params: UpdateParams
    ) {

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

    async delete(
        id: string
    ) {

        return this.deleter.deleteById(
            id
        )

    }

}