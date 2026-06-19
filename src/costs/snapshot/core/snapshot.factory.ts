import { ItemSeed } from "@/costs/rule/types/items.types";
import { Injectable } from "@nestjs/common";
import { ItemType } from "@/costs/enums/item.enum";
import { TaxItem } from "../tax/types/service.type";

@Injectable()
export class SnapshotFactory {

    /**
     * 
     * @param items 
     * @returns 
     */

    parseToTaxItem(
        items: ItemSeed[]
    ) {

        const payloads: TaxItem[] = [];

        for (const item of items) {

            const {
                type,
                taxId,
                value,
                id
            } = item;

            if (
                type !== ItemType.TAX ||
                !taxId
            ) continue;

            payloads.push({
                id,
                taxId,
                value
            })

        }

        return payloads;

    }

}