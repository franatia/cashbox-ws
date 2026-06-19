export type OrmParams = {
    productId?: string,
    featureGroupId?: string,
    featureValuesId?: string[],
    projectId?: string,
    groupId?: string,
    name?: string,
    sku?: string,
    webVisibility?: boolean;
    basePrice?: number;
    baseCost?: number;
    costId?: string;
}

export type UpdateParams = {
    name?: string,
    sku?: string,
    baseCost?: number;
    basePrice?: number;
    webVisibility?: boolean,
    costId?: string,
}

export type UpdateSameContentParams = {
    productId?: string;
    itemGroupId?: string;
    itemsId?: string[]
}