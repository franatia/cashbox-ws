import {BaseService} from "@/common/models/crud/base-service.crud";
import { ItemSnapshotQuery } from "./item-snapshot.query";
import { Injectable } from "@nestjs/common";
import { CreateParams } from "./types/param/service.param";

@Injectable()
export class ItemSnapshotService implements BaseService {

    constructor(
        private readonly query : ItemSnapshotQuery
    ){}

    /**
     * 
     * @param params 
     * @returns 
     */

    create(
        params : CreateParams
    ){
        return this.query.saveOne(
            params
        );
    }

    /**
     * 
     * @param params 
     * @returns 
     */

    createMany(
        params : CreateParams[]
    ){
        return this.query.saveMany(
            params
        );
    }

}