export enum CostTag {
    TAX = "TAX",
    TAX_EXEMPT = "TAX_EXEMPT",
    TARIFF = "TARIFF",
    PRODUCT_BASE_COST = "PRODUCT_BASE_COST",
    SHIPPING = "SHIPPING",
    INSURANCE = "INSURANCE",
    OTHER = "OTHER",
    GADGET = "GADGET"
}

export const CostTagList = Object.values(CostTag);