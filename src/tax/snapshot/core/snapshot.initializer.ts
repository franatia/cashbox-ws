import { BaseInitializer } from "@/common/models/crud/base-initializer.crud";
import { ItemSnapshotService } from "../item/item-snapshot.service";
import { Injectable } from "@nestjs/common";
import { TaxSnapshot } from "@/tax/entities/snapshot/snapshot.entity";
import { ItemCreateParams } from "./types/param/service.param";

@Injectable()
export class SnapshotInitializer {

    constructor(
        private readonly itemSnapshotService : ItemSnapshotService
    ){}

    /**
     * 
     * @param snapshot 
     * @param itemParams 
     * @returns 
     */

    async initialize(
        snapshot : TaxSnapshot,
        itemParams : ItemCreateParams[]
    ) : Promise<TaxSnapshot>{

        const items = await this.itemSnapshotService.createMany(
            itemParams.map(itemParam => ({
                ...itemParam,
                snapshotId : snapshot.id
            }))
        );

        return {
            ...snapshot,
            items
        }

    }

}