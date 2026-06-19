import { ItemType } from "./item.enum"
import { CostTag } from "./tag.enum"

export type ItemSnapshotType = ItemType.PRODUCT_BASE_COST |
    ItemType.CONSTANT |
    ItemType.OTHER

export enum ItemSnapshotTypeEnum {
    PRODUCT_BASE_COST = "PRODUCT_BASE_COST",
    CONSTANT = "CONSTANT",
    OTHER = "OTHER"
}

export const ItemSnapshotTypeList = [
    ItemType.PRODUCT_BASE_COST,
    ItemType.CONSTANT,
    ItemType.OTHER
]

export type ItemSnapshotTag = CostTag.INSURANCE |
 CostTag.OTHER |
 CostTag.TARIFF |
 CostTag.PRODUCT_BASE_COST |
 CostTag.SHIPPING |
 CostTag.TAX_EXEMPT;

export enum ItemSnapshotTagEnum {
    INSURANCE = "INSURANCE",
    OTHER = "OTHER",
    TARIFF = "TARIFF",
    PRODUCT_BASE_COST = "PRODUCT_BASE_COST",
    SHIPPING = "SHIPPING",
    TAX_EXEMPT = "TAX_EXEMPT"
}

export const ItemSnapshotTagList = [
    CostTag.INSURANCE,
    CostTag.OTHER,
    CostTag.TARIFF,
    CostTag.PRODUCT_BASE_COST,
    CostTag.SHIPPING,
    CostTag.TAX_EXEMPT
]