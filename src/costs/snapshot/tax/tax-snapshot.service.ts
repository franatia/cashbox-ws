import { SnapshotService } from "@/tax/snapshot/core/snapshot.service";
import { TaxItem } from "./types/service.type";
import { TaxQuery } from "@/tax/core/tax.query";
import { RuleSeed } from "@/costs/rule/types/rule.types";
import { TaxItemPayload } from "./types/payload/service.payload";
import { CostRuleSeed } from "@/costs/rule/models/seed.model";
import { roundDecimal } from "@/common/helpers/calculator.helper";
import { TaxSnapshotFactory } from "./tax-snapshot.factory";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TaxSnapshotService {

    constructor(
        private readonly factory: TaxSnapshotFactory,

        private readonly taxQuery : TaxQuery,

        private readonly snapshotService : SnapshotService
    ){}

    /**
     * 
     * CREATORS
     * 
     */

    /**
     * 
     * @param payloads 
     * @returns 
     */

    private createTaxSnapshot(
        payloads : TaxItemPayload[]
    ){

        let total = 0;

        for(const payload of payloads){
            total += payload.total;
        }

        return this.snapshotService.create({
            total,
            items : payloads
        })

    }

    /**
     * 
     * PREPARES
     * 
     */

    /**
     * 
     * @param taxItems 
     * @returns 
     */

    private async prepareTaxItemPayloads(
        taxItems: TaxItem[]
    ) {

        const taxes = await this.getTaxes(taxItems);

        return this.factory.buildTaxItemPayloads(
            taxItems,
            taxes
        );

    }

    /**
     * 
     * RESOLVERS
     * 
     */

    /**
     * 
     * @param items 
     */

    async resolveCreateTaxSnapshot(
        taxItems : TaxItem[],
        seed: CostRuleSeed
    ) {

        const payloads = await this.prepareTaxItemPayloads(
            taxItems
        );

        this.resolveTaxItemPayloadValues(
            this.factory.mapTaxItemPayloadsById(payloads),
            seed
        );

        return this.createTaxSnapshot(
            payloads
        );

    }

    /**
     * 
     * @param payloadMap 
     * @param seed 
     */

    private resolveTaxItemPayloadValues(
        payloadMap: Map<string, TaxItemPayload>,
        seed: CostRuleSeed
    ) {

        const fixTaxItems = this.resolveFixTaxes(
            payloadMap,
            seed
        );

        const specificTaxItems = this.resolveSpecificTaxes(
            payloadMap,
            seed
        );

        const taxItems = this.resolveTaxes(
            payloadMap,
            seed
        );

        return new Set(
            [
                ...fixTaxItems,
                ...specificTaxItems,
                ...taxItems
            ]
        )

    }

    /**
     * 
     * @param payloadMap 
     * @param seed 
     * @returns 
     */

    private resolveFixTaxes(
        payloadMap: Map<string, TaxItemPayload>,
        seed: CostRuleSeed
    ) : TaxItemPayload[] {

        return this.resolveTaxRules(
            seed.fixTaxRules,
            payloadMap,
            payload => {
                payload.total = roundDecimal(
                    payload.value / seed.quantity
                );
            }
        );

    }

    /**
     * 
     * @param payloadMap 
     * @param seed 
     * @returns 
     */

    private resolveSpecificTaxes(
        payloadMap: Map<string, TaxItemPayload>,
        seed: CostRuleSeed
    ) : TaxItemPayload[] {

        return this.resolveTaxRules(
            seed.specificTaxRules,
            payloadMap,
            payload => {
                payload.total = payload.value
            }
        )

    }

    private resolveTaxes(
        payloadMap: Map<string, TaxItemPayload>,
        seed: CostRuleSeed
    ) : TaxItemPayload[] {

        const rules = seed.taxRules;

        return rules.flatMap(
            rule => {

                const taxBase = this.calculateTaxBaseFromTaxRule(
                    rule,
                    seed
                );

                return this.resolveTaxRules(
                    [rule],
                    payloadMap,
                    payload => {

                        payload.total = payload.value * taxBase;

                    }
                )

            }
        )

    }

    /**
     * 
     * @param rule 
     * @param payloadMap 
     * @param cb 
     * @returns 
     */

    private resolveTaxRules(
        rules: RuleSeed[],
        payloadMap: Map<string, TaxItemPayload>,
        cb: (payload: TaxItemPayload) => void
    ) {

        const payloads: TaxItemPayload[] = [];

        const itemsId = rules.filter(
            rule => rule.itemsId?.length
        ).flatMap(
            rule => rule.itemsId!
        )

        for (const item of itemsId) {

            const payload = payloadMap.get(item);

            if (!payload) continue;

            cb(payload);

            payloads.push(payload);

        }

        return payloads;

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param rules 
     * @param taxItems 
     */

    private async getTaxes(
        taxItems: TaxItem[]
    ) {

        const ids = taxItems.map(tax => tax.id);

        return this.taxQuery.findManyByIds(ids);

    }

    /**
     * 
     * @param rule 
     * @param seed 
     * @returns 
     */

    private calculateTaxBaseFromTaxRule(
        rule: RuleSeed,
        seed: CostRuleSeed
    ): number {

        const parentRule = seed.getParent(rule);

        let base = 0;

        for (const partial of parentRule.result.partials) {

            if (partial.id === rule.id) continue;

            base += partial.value;

        }

        return base;

    }

}