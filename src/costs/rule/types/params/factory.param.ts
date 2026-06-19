import { ProductItemParams } from "./product-item.param";

export type StrictProductItemParser = ProductItemParams & {
    costId : string
}