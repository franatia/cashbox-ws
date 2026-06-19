import { Injectable } from "@nestjs/common";
import { CreateParams } from "./types/params/service.param";
import { ItemSnapshotQuery } from "./item-snapshot.query";
import { ItemSnapshotFactory } from "./item-snapshot.factory";
import { ItemSeed } from "@/costs/rule/types/items.types";
import { ItemSnapshotTagList, ItemSnapshotTypeList } from "@/costs/enums/snapshot.enum";

@Injectable()
export class ItemSnapshotService {

    constructor(
        private readonly query : ItemSnapshotQuery,
        private readonly factory : ItemSnapshotFactory
    ){}

    /**
     * 
     * @param params 
     * @returns 
     */

    createOne(
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

        return this.query.saveMany(params);

    }

    /**
     * 
     * RESOLVERS
     * 
     */

    /**
     * 
     * @param snapshotId 
     * @param items 
     * @returns 
     */

    createBySnapshotData(
        snapshotId : string,
        items : ItemSeed[]
    ){

        const filteredItems = this.filterCorrectItems(items);

        const payload = this.factory.parseToItemSnapshotPayload(
            filteredItems
        );

        return this.createMany(
            payload.map(item => ({
                ...item,
                costSnapshotId: snapshotId
            }))
        )

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param items 
     * @returns 
     */

    filterCorrectItems(
        items : ItemSeed[]
    ){
        return items.filter(
            ({
                type,
                tags
            }) => (
            ItemSnapshotTypeList.includes(type) &&
            !tags.some(tag => !ItemSnapshotTagList.includes(tag))
        ));
    }

}