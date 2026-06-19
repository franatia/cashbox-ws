import { Injectable } from "@nestjs/common";
import { ItemSnapshotPayload } from "./types/payload/factory.payload";
import { ItemSeed } from "@/costs/rule/types/items.types";
import { ItemSnapshotType, ItemSnapshotTypeList } from "@/costs/enums/snapshot.enum";

@Injectable()
export class ItemSnapshotFactory {

    parseToItemSnapshotPayload(
        items: ItemSeed[]
    ) {
        const payloads: ItemSnapshotPayload[] = [];

        for (const item of items) {

            const {
                name,
                tags,
                value,
                type
            } = item;

            payloads.push({
                name,
                tags,
                value,
                type: type as ItemSnapshotType
            });

        }

        return payloads;
    }

}