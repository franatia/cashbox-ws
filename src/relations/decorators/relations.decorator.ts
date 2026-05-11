import { SetMetadata } from "@nestjs/common";

export const RELATIONS_CONFIG = "relations-config";

export enum RelationsRule {
    USER_TO_PROJECT = "user-project",
    NODE_TO_PROJECT = "node-project",
    NODES_TO_PROJECT = "nodes-project",
    COLLABORATOR_TO_PROJECT = "collaborator-project",
    COLLABORATOR_TO_NODE = "collaborator-node",
    COLLABORATOR_TO_USER = "collaborator-user",
    COLLABORATOR_NOT_LINKED_TO_USER = "collaborator-not-linked-user",

    PRODUCT_TO_PROJECT = "product-project",
    PRODUCTS_TO_PROJECT = "products-project",
    
    PRODUCT_ITEM_TO_PROJECT = "productItem-project",
    PRODUCT_ITEMS_TO_PROJECT = "productItems-project",
    PRODUCT_ITEMS_TO_PRODUCT = "productItems-product",
    PRODUCT_ITEMS_NOT_LINKED_TO_PRODUCT = "productItems-not-linked-product",

    PRODUCT_ITEM_GROUP_TO_PROJECT = "productItemGroup-project",

    FEATURES_TO_PRODUCT = "features-product",
    FEATURE_TO_PRODUCT = "feature-product",
    FEATURE_TO_PROJECT = "feature-project",
    
    FEATURE_VALUES_TO_PRODUCT = "featureValues-product",
    FEATURE_VALUES_TO_FEATURE = "featureValues-feature",
    FEATURE_VALUES_TO_PROJECT = "featureValues-project",

    PRODUCT_GROUP_TO_PROJECT = "productGroup-project",

    FEATURE_GROUP_TO_PRODUCT = "featureGroup-product",
    FEATURE_GROUP_TO_PROJECT = "featureGroup-project",
    
    FEATURE_GROUP_ITEM_TO_GROUP = "featureGroupItem-group",

    FEATURES_TO_FEATURE_GROUP = "features-featureGroup",

    FEATURE_VALUES_RELATED_TO_PRODUCT_ITEM_GROUP = "featureValues-related-productItemGroup",
    PRODUCT_ITEMS_RELATED_TO_PRODUCT_ITEM_GROUP = "productItems-related-productItemGroup",

    COMPLEMENT_TO_PROJECT = "complement-project",

    COMPOSITY_TO_PROJECT = "composity-project",
    PRODUCT_HAS_NOT_COMPOSITY_ITEMS = "product-has-not-composity-items",
}

export type RelationsConfigItem = {
    rule: RelationsRule,
    from : string,
    to : string
}

export const RelationsConfig = (...config : RelationsConfigItem[]) => SetMetadata(
    RELATIONS_CONFIG,
    config
)