import { BadRequestException } from "@nestjs/common";
import { resolveUnitData } from "../helpers/unit.helper";
import { PrepareUpdateUnitPayload } from "./types/payloads/factory.payload";
import { ResolveUnitParams } from "../helpers/types/unit.type";

export class ItemFactory {

    /**
         * 
         * @param params 
         * @returns 
         */

    prepareUpdateUnitPayload(
        params: ResolveUnitParams
    ): PrepareUpdateUnitPayload {

        const {
            quantity,
            remaining
        } = resolveUnitData(params);

        if (!quantity && !remaining) {
            throw new BadRequestException(
                "Stock item quantity or remaining are required"
            );
        }

        return {
            quantity,
            remaining
        }

    }

}