import { ItemType } from "@/costs/enums/item.enum"
import { ValueSource } from "@/costs/enums/source.enum"
import { CostTag } from "@/costs/enums/tag.enum"

type ItemTemplate = {
    type : ItemType,
    valueSource : ValueSource,
    defaultValue : number,
    tags : CostTag[],
    name ?: string
}

export const taxIntegerItemTemplate : ItemTemplate = {
    "type" : ItemType.OTHER,
    "valueSource" : ValueSource.SYSTEM,
    "defaultValue" : 1,
    "tags" : [CostTag.GADGET]
}

export const productBaseCostItemTemplate : ItemTemplate = {
    "type" : ItemType.PRODUCT_BASE_COST,
    "valueSource" : ValueSource.SYSTEM,
    "defaultValue" : 1,
    "name" : "Costo Base del Producto",
    "tags" : [CostTag.PRODUCT_BASE_COST]
}