import { nanoid } from 'nanoid/non-secure'

export enum SkuPrefix {

    PRODUCT_ITEM = "PIT"
    
}

export const buildSku = (prefix : SkuPrefix) => {

    return `${prefix}-${nanoid(8)}`

}