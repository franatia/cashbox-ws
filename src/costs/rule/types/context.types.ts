/**
 * 
 * Here we save the data structure that describes 
 * a context
 * 
 */

import { Item } from "@/costs/entities/item.entity";
import { ItemInputData } from "./items.types";

export type CalculateContext = {
    costId : string;
    productItemId : string;
}


export type ItemContext = {
    item : Item,
    inputData ?: ItemInputData
}