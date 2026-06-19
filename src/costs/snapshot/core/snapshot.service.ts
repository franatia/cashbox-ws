import { CostRuleSeed } from "@/costs/rule/models/seed.model";
import { Injectable } from "@nestjs/common";
import { SnapshotQuery } from "./snapshot.query";
import CostSnapshot from "@/costs/entities/snapshot/snapshot.entity";
import { SnapshotInitializer } from "./snapshot.initializer";

@Injectable()
export class SnapshotService {

    constructor(
        private readonly query: SnapshotQuery,
        private readonly initializer : SnapshotInitializer
    ) { }

    /**
     * 
     * @param seed 
     * @returns 
     */

    async create(
        seed: CostRuleSeed
    ): Promise<CostSnapshot> {

        const snapshot = await this.query.saveOne({
            unitCost: seed.unitCost
        });

        return this.initializer.initialize(
            snapshot,
            seed
        )

    }


}