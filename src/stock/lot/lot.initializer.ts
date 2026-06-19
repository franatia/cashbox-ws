import CostService from "@/costs/core/cost.service";
import { CalculateParams } from "@/costs/core/types/params/service.params";
import CostSnapshot from "@/costs/entities/snapshot/snapshot.entity";
import { SnapshotService } from "@/costs/snapshot/core/snapshot.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LotInitializer {

    constructor(
        private readonly costService : CostService,

        private readonly costSnapshotService : SnapshotService
    ){}

    async resolveCosts(
        params : CalculateParams
    ) : Promise<CostSnapshot> {

        const calculation = await this.costService.calculate(params);

        return this.costSnapshotService.create(
            calculation.seed
        );

    }

}