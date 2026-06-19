import Tax from "@/tax/entities/tax.entity";
import { TaxItem } from "./types/service.type";
import { TaxItemPayload } from "./types/payload/service.payload";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class TaxSnapshotFactory {

    constructor() { }

    /**
     * 
     * BUILDERS
     * 
     */

    /**
     * 
     * @param taxItems 
     * @param taxes 
     * @returns 
     */

    buildTaxItemPayloads(
        taxItems: TaxItem[],
        taxes: Tax[]
    ) {

        const taxMap = this.mapTaxesById(taxes);
        const payloads: TaxItemPayload[] = [];

        taxItems.forEach(item => {

            payloads.push(
                this.buildTaxItemPayload(
                    item,
                    taxMap
                )
            )

        });

        return payloads;

    }

    /**
     * 
     * @param taxItem 
     * @param taxMap 
     * @returns 
     */

    buildTaxItemPayload(
        taxItem: TaxItem,
        taxMap: Map<string, Tax>
    ) : TaxItemPayload {

        const tax = taxMap.get(taxItem.taxId);

        if (!tax) {
            throw new BadRequestException(
                "Tax required does not exists"
            );
        }

        const {
            alias,
            country,
            jurisdiction,
            locality,
            denomination,
            valueType,
            state
        } = tax;

        return {
            ...taxItem,
            alias,
            country,
            state : state ?? undefined,
            locality : locality ?? undefined,
            denomination,
            jurisdiction,
            valueType,
            total: 0
        }

    }

    /**
     * 
     * MAPPERS
     * 
     */

    /**
     * 
     * @param payloads 
     * @returns 
     */

    mapTaxItemPayloadsById(
        payloads: TaxItemPayload[]
    ) {

        const map = new Map<string, TaxItemPayload>();

        for (const payload of payloads) {

            if (map.has(payload.id)) continue;

            map.set(
                payload.id,
                payload
            );

        }

        return map;

    }

    /**
     * 
     * @param taxes 
     * @returns 
     */

    mapTaxesById(
        taxes: Tax[]
    ) {

        const map = new Map<string, Tax>();

        for (const tax of taxes) {
            if (map.has(tax.id)) continue;

            map.set(
                tax.id,
                tax
            );
        }

        return map;

    }

}