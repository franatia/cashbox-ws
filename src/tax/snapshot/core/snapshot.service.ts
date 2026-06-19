import {BaseService} from "@/common/models/crud/base-service.crud";
import { CreateParams } from "./types/param/service.param";
import { Injectable } from "@nestjs/common";
import { SnapshotQuery } from "./snapshot.query";
import { SnapshotInitializer } from "./snapshot.initializer";

@Injectable()
export class SnapshotService implements BaseService {

    constructor(
        private readonly query : SnapshotQuery,
        private readonly initializer : SnapshotInitializer
    ){ }

    /**
     * 
     * @param params
     * @returns 
     */

    async create(
        params : CreateParams
    ){

        const {
            items,
            total
        } = params;

        const snapshot = await this.query.saveOne({
            total
        });

        return this.initializer.initialize(
            snapshot,
            items
        )

    }


}