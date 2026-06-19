import { BadRequestException } from "@nestjs/common";
import { ProductItemParams } from "../types/params/product-item.param";

export const resolveStrictProductItemParams = (
    ...params : ProductItemParams[]
) => {
    return params.map(param => {
            const {
                baseCost,
                ...rest
            } = param;

            if(!baseCost){
                throw new BadRequestException("Base cost is not valid");
            }

            return {
                baseCost,
                ...rest
            }
        })
}