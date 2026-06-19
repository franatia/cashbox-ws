import { ItemType } from "@/costs/enums/item.enum";
import { CostTag } from "@/costs/enums/tag.enum";

/**
 * 
 * STRUCTURES DATA
 * 
 */

export type ItemInputData = {
    id : string;
    value : number;
}

/**
 * 
 * CALCULATION SEED
 * 
 */

export type ItemSeed = {
    id : string;
    name : string;
    type : ItemType;
    value : number; // Value injected from own-self or some relational entity (Constant or Tax)
    tags : CostTag[];
    taxId ?: string;
    constantId ?: string;
}