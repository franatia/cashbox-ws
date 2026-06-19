import { BadRequestException, Injectable } from "@nestjs/common";
import { PrepareUpdateUnitPayload } from "./types/payload/factory.payload";
import { ResolveUnitParams } from "../helpers/types/unit.type";
import { resolveUnitData } from "../helpers/unit.helper";

@Injectable()
export class StockFactory {

    constructor() { }

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