import { CostAccess } from "@/costs/enums/access.enum";
import { ItemInputData } from "@/costs/rule/types/items.types";
import { ProductItemParams } from "@/costs/rule/types/params/product-item.param";

export type CreateParams = {
    name: string;
    access: CostAccess;
    projectId: string;
    productItemsId?: string[]
}

export type PutParams = {
    name?: string;
    access?: CostAccess;
    productItemsId?: string[]
}

export type CalculateParams = {
    productItem: ProductItemParams,
    inputData ?: ItemInputData[]
}