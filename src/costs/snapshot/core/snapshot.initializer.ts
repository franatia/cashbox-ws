import { SnapshotQuery } from "./snapshot.query";
import { ItemSnapshotService } from "../item/item-snapshot.service";
import CostSnapshot from "@/costs/entities/snapshot/snapshot.entity";
import { CostRuleSeed } from "@/costs/rule/models/seed.model";
import { SnapshotFactory } from "./snapshot.factory";
import { TaxSnapshotService } from "../tax/tax-snapshot.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SnapshotInitializer {

    constructor(
        private readonly query: SnapshotQuery,
        private readonly factory: SnapshotFactory,

        private readonly itemService: ItemSnapshotService,
        private readonly taxService: TaxSnapshotService
    ) { }

    /**
     * 
     * INITIALIZED
     * 
     */

    /**
     * 
     * @param snapshot 
     * @param seed 
     * @returns 
     */

    async initialize(
        snapshot: CostSnapshot,
        seed: CostRuleSeed
    ): Promise<CostSnapshot> {

        const items = await this.itemService.createBySnapshotData(
            snapshot.id,
            seed.itemsList
        );

        const taxSnapshot = await this.prepareCreateTaxSnapshot(
            seed
        );

        if (taxSnapshot) {
            await this.query.updateTaxSnapshotId(
                snapshot.id,
                taxSnapshot.id
            )
        }

        return {
            ...snapshot,
            taxSnapshot,
            items
        }

    }

    /**
    * 
    * PREPARATORS
    * 
    */

    /**
     * 
     * @param seed 
     * @returns 
     */

    private prepareCreateTaxSnapshot(
        seed: CostRuleSeed
    ) {

        const taxItems = this.factory.parseToTaxItem(
            seed.itemsList
        );

        if (!taxItems.length) return;

        return this.taxService.resolveCreateTaxSnapshot(
            taxItems,
            seed
        );

    }

}