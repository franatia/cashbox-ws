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
    PRODUCT_ITEM_TO_COST = "productItem-cost",

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

    TAX_TO_PROJECT_PROFILE = "tax-projectProfile",
    TAX_TO_PROJECT = "tax-project",

    COST_CONSTANT_TO_PROJECT = "costConstant-project",
    COST_TO_PROJECT = "cost-project",
    COST_TO_PRODUCT_ITEM = "cost-productItem",

    COST_ITEM_TO_PROJECT = "costItem-project",
    COST_ITEMS_TO_COST = "costItems-cost",

    COST_RULE_TO_PROJECT = "costRule-project",
    COST_RULE_TO_COST = "costRule-cost",
    COST_RULES_TO_COST = "costRules-cost",

    COST_RULE_RELATED_TO_COST_RULES = "costRule-related-costRules",
    COST_RULE_RELATED_TO_COST_ITEMS = "costRule-related-costItems",

    STOCK_TO_PROJECT = "stock-project",
    STOCK_TO_PRODUCT_ITEM = "stock-productItem",

    STOCK_ITEM_TO_PROJECT = "stockItem-project",
    STOCK_ITEM_TO_NODE = "stockItem-node",
    STOCK_ITEM_TO_PRODUCT_ITEM = "stockItem-productItem",
    STOCK_ITEM_TO_STOCK = "stockItem-stock",

    LOT_TO_PROJECT = "lot-project",
    LOT_TO_NODE = "lot-node",
    LOT_TO_PRODUCT_ITEM = "lot-productItem",
    LOT_TO_STOCK_ITEM = "lot-stockItem",
    LOTS_TO_STOCK_ITEM = "lots-stockItem",
    LOT_TO_RESERVE = "lot-reserve",
    LOT_TO_COST_SNAPSHOT = "lot-costSnapshot",

    STOCK_MOVEMENT_TO_PROJECT = "stockMovement-project",
    STOCK_MOVEMENT_TO_NODE = "stockMovement-node",
    STOCK_MOVEMENT_TO_USER = "stockMovement-user",
    STOCK_MOVEMENT_TO_LOT = "stockMovement-lot",
    STOCK_MOVEMENT_TO_STOCK_ITEM = "stockMovement-stockItem",
    STOCK_MOVEMENT_TO_STOCK = "stockMovement-stock",
    STOCK_MOVEMENT_TO_TRANSFER_ITEM = "stockMovement-transferItem",
    STOCK_MOVEMENT_TO_TRANSFER = "stockMovement-transfer",

    STOCK_TRANSFER_TO_PROJECT = "stockTransfer-project",
    STOCK_TRANSFER_TO_SOURCE_NODE = "stockTransfer-sourceNode",
    STOCK_TRANSFER_TO_TARGET_NODE = "stockTransfer-targetNode",
    STOCK_TRANSFER_TO_NODE = "stockTransfer-node",
    STOCK_TRANSFER_TO_USER = "sotckTransfer-user",

    STOCK_TRANSFER_ITEM_TO_PROJECT = "stockTransferItem-project",
    STOCK_TRANSFER_ITEM_TO_SOURCE_NODE = "stockTransferItem-sourceNode",
    STOCK_TRANSFER_ITEM_TO_TARGET_NODE = "stockTransferItem-targetNode",
    STOCK_TRANSFER_ITEM_TO_NODE = "stockTransferItem-node",
    STOCK_TRANSFER_ITEM_TO_PRODUCT_ITEM = "stockTransferItem-productItem",
    STOCK_TRANSFER_ITEM_TO_TRANSFER = "stockTransferItem-transfer",

    STOCK_MOVEMENTS_LINKER_TO_PROJECT = "stockMovementsLinker-project",
    STOCK_MOVEMENTS_LINKER_TO_NODE = "stockMovementsLinker-node",
    STOCK_MOVEMENTS_LINKER_TO_MOVEMENT = "stockMovementsLinker-movement",
    STOCK_MOVEMENTS_LINKER_TO_SOURCE_MOVEMENT = "stockMovementsLinker-sourceMovement",
    STOCK_MOVEMENTS_LINKER_TO_TARGET_MOVEMENT = "stockMovementsLinker-targetMovement",
    STOCK_MOVEMENTS_LINKER_TO_TRANSFER_ITEM = "stockMovementsLinker-transferItem",
    STOCK_MOVEMENTS_LINKER_TO_TRANSFER = "stockMovementsLinker-transfer"
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