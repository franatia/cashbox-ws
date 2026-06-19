import { ItemInputData } from "../items.types";
import { ProductItemParams, StrictProductItemParams } from "./product-item.param";

export type CalculateParams = {
    productItemParams : ProductItemParams;
    inputData : Map<string, ItemInputData>
}

export type DataSeedParams = CalculateParams & {
    productItemParams : StrictProductItemParams,
}