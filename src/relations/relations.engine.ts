import { BadRequestException, Injectable } from "@nestjs/common";
import { RelationsRule } from "./decorators/relations.decorator";
import { ProductService } from "@/product/core/product.service";
import { ItemGroupService } from "@/product/item-group/item-group.service";
import { FeatureValuesService } from "@/product/feature-values/feature-values.service";
import { FeatureGroupService } from "@/product/feature-group/feature-group.service";
import { FeaturesService } from "@/product/features/features.service";
import { ItemService as ProductItemService } from "@/product/item/item.service";
import { GroupService } from "@/product/group/group.service";
import { ComplementService } from "@/product/complement/complement.service";
import ComposityService from "@/product/composity/composity.service";
import TaxService from "@/tax/core/tax.service";
import { ConstantRelations as CostConstantRelations } from "@/costs/constant-cost/constant.relations";
import { CostRelations } from "@/costs/core/cost.relations";
import {ItemRelations as CostItemRelations} from "@/costs/item/item.relations";
import {RuleRelations as CostRuleRelations} from "@/costs/rule/rule.relations";
import { StockRelations } from "@/stock/core/stock.relations";
import { ItemRelations as StockItemRelations } from "@/stock/item/item.relations";
import {LotRelations} from "@/stock/lot/lot.relations";
import {MovementRelations as StockMovementRelations} from "@/stock/movement/movement.relations";
import { TransferRelations as StockTransferRelations } from "@/stock/transfer/transfer.relations";
import { TransferItemRelations as StockTransferItemRelations } from "@/stock/transfer-item/transfer-item.relations";
import { MovementsLinkerRelations as StockMovementsLinkerRelations} from "@/stock/movements-linker/movements-linker.relations";
import { ProjectRelations } from "@/project/core/query/project.relations";
import { NodeRelations } from "@/project/node/node.relations";
import { CollaboratorRelations } from "@/project/collaborator/query/collaborator.relations";

type RelationHandler = (from: any[], to: any[]) => Promise<void>;

@Injectable()
export class RelationsEngine {

    constructor(
        private readonly projectRelations : ProjectRelations,
        private readonly nodeRelations : NodeRelations,
        private readonly collaboratorRelations : CollaboratorRelations,

        private readonly productService: ProductService,
        private readonly productItemService: ProductItemService,
        private readonly productGroupService: GroupService,
        private readonly productItemGroupService: ItemGroupService,

        private readonly featuresService: FeaturesService,
        private readonly featureValuesService: FeatureValuesService,
        private readonly featureGroupService: FeatureGroupService,

        private readonly complementService: ComplementService,
        private readonly composityService: ComposityService,
        
        private readonly taxService : TaxService,
        private readonly costConstantRelations : CostConstantRelations,
        private readonly costRelations : CostRelations,
        private readonly costItemRelations : CostItemRelations,
        private readonly costRuleRelations : CostRuleRelations,
    
        private readonly stockRelations : StockRelations,
        private readonly stockItemRelations : StockItemRelations,
        private readonly lotRelations : LotRelations,
        private readonly stockMovementRelations : StockMovementRelations,
        private readonly stockTransferRelations : StockTransferRelations,
        private readonly stockTransferItemRelations : StockTransferItemRelations,
        private readonly stockMovementsLinkerRelations : StockMovementsLinkerRelations
    ) { }

    private handlers: Record<RelationsRule, RelationHandler> = {

        [RelationsRule.USER_TO_PROJECT]: async ([from], [to]) => {
            const isOwner = await this.projectRelations.linkedToOwner(
                to,
                from
            );

            if(!isOwner){
                throw new BadRequestException("User is not owner of project")
            }

        },

        "node-project": async ([from], [to]) => {
            await this.nodeRelations.linkedToProject(
                from,
                to
            );
        },

        "nodes-project": async (from, [to]) => {
            await this.nodeRelations.manyLinkedToProject(
                from,
                to
            );
        },

        "collaborator-project": async ([from], [to]) => {
            await this.collaboratorRelations.linkedToProject(
                from,
                to
            );
        },

        "collaborator-node": async ([from], [to]) => {
            await this.collaboratorRelations.linkedToNode(
                from,
                to
            );
        },

        "collaborator-user": async ([from], [to]) => {
            await this.collaboratorRelations.linkedToUser(
                from,
                to
            );
        },

        [RelationsRule.COLLABORATOR_NOT_LINKED_TO_USER] : async ([from], [to]) => {
            await this.collaboratorRelations.notLinkedToUser(
                from,
                to
            )
        },

        "product-project": async ([from], [to]) => {
            await this.productService.linkedToProject(
                from,
                to
            );
        },

        "productItem-project": async ([from], [to]) => {
            await this.productItemService.linkedToProject(
                from,
                to
            );
        },

        "productItems-project": async (from, [to]) => {
            await this.productItemService.manyLinkedToProject(
                from,
                to
            );
        },

        "productItems-product": async (from, [to]) => {
            await this.productItemService.manyLinkedToProduct(
                from,
                to
            );
        },

        "features-product": async (from, [to]) => {
            await this.featuresService.linkedToProduct(
                from,
                to
            );
        },

        "feature-product": async (from, [to]) => {
            await this.featuresService.linkedToProduct(
                from,
                to
            );
        },

        "featureValues-product": async (from, [to]) => {
            await this.featureValuesService.manyLinkedToProduct(
                from,
                to
            );
        },

        "featureValues-feature": async (from, [to]) => {
            this.featureValuesService.manyLinkedToFeature(
                from,
                to
            )
        },

        "productGroup-project": async ([from], [to]) => {
            await this.productGroupService.linkedToProject(
                from,
                to
            )
        },

        "featureGroup-product": async ([from], [to]) => {
            await this.featureGroupService.linkedToProduct(
                from,
                to
            );
        },

        "featureGroupItem-group": async ([from], [to]) => {
            await this.featureGroupService.itemLinkedToGroup(
                from,
                to
            );
        },

        "features-featureGroup": async (from, [to]) => {
            await this.featuresService.manyLinkedToGroup(
                from,
                to
            );
        },

        [RelationsRule.PRODUCT_ITEM_GROUP_TO_PROJECT]: async ([from], [to]) => {
            await this.productItemGroupService.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.FEATURE_VALUES_RELATED_TO_PRODUCT_ITEM_GROUP]: async (from, [to]) => {
            const has = await this.productItemGroupService.hasFeatureValues(
                to,
                from
            )
            if (!has) throw new BadRequestException("Feature values are not related with item group")
        },

        [RelationsRule.FEATURE_VALUES_TO_PROJECT]: async (from, [to]) => {
            await this.featureValuesService.manyLinkedToProject(
                from,
                to
            )
        },

        [RelationsRule.PRODUCT_ITEMS_RELATED_TO_PRODUCT_ITEM_GROUP]: async (from, [to]) => {
            const has = await this.productItemGroupService.hasItems(
                to,
                from
            )

            if (!has) throw new BadRequestException("Items are not related with item group")

        },

        [RelationsRule.FEATURE_GROUP_TO_PROJECT]: async ([from], [to]) => {
            await this.featureGroupService.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.FEATURE_TO_PROJECT]: async ([from], [to]) => {
            await this.featuresService.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.COMPLEMENT_TO_PROJECT]: async ([from], [to]) => {
            await this.complementService.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.PRODUCT_ITEMS_NOT_LINKED_TO_PRODUCT]: async (from, [to]) => {
            await this.productItemService.manyNotLinkedToProduct(
                from,
                to
            )
        },

        [RelationsRule.COMPOSITY_TO_PROJECT]: async ([from], [to]) => {
            await this.composityService.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.PRODUCT_HAS_NOT_COMPOSITY_ITEMS]: async ([from], to) => {
            await this.composityService.productHasNotComposityItems(
                from,
                to
            )
        },

        [RelationsRule.PRODUCTS_TO_PROJECT]: async(from, [to]) => {
            await this.productService.manyLinkedToProject(
                from,
                to
            )
        },

        [RelationsRule.TAX_TO_PROJECT] : async([from], [to]) => {
            await this.taxService.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.TAX_TO_PROJECT_PROFILE] : async([from], [to]) => {
            await this.taxService.linkedToProjectProfile(
                from,
                to
            )
        },

        [RelationsRule.COST_CONSTANT_TO_PROJECT] : async([from], [to]) => {
            await this.costConstantRelations.linkedToProject(
                from,
                to
            )
        },
        
        [RelationsRule.COST_TO_PROJECT] : async([from], [to]) => {
            await this.costRelations.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.COST_TO_PRODUCT_ITEM] : async([from], [to]) => {

            await this.costRelations.linkedToProductItem(
                from,
                to
            )

        },

        [RelationsRule.COST_ITEM_TO_PROJECT] : async([from], [to]) => {
            await this.costItemRelations.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.COST_RULE_TO_COST] : async([from], [to]) => {
            await this.costRuleRelations.linkedToCost(
                from,
                to
            )
        },

        [RelationsRule.COST_RULE_TO_PROJECT] : async([from], [to]) => {
            await this.costRuleRelations.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.COST_RULE_RELATED_TO_COST_RULES] : async ([from], to) => {
            await this.costRuleRelations.relatedWithRules(
                from,
                to
            )
        },

        [RelationsRule.COST_RULE_RELATED_TO_COST_ITEMS] : async ([from], to) => {
            await this.costRuleRelations.relatedWithItems(
                from,
                to
            )
        },

        [RelationsRule.COST_RULES_TO_COST] : async (from, [to]) => {
            await this.costRuleRelations.manyLinkedToCost(
                from,
                to
            )
        },

        [RelationsRule.PRODUCT_ITEM_TO_COST] : async ([from], [to]) => {
            await this.productItemService.linkedToCost(
                from,
                to
            )
        },

        [RelationsRule.COST_ITEMS_TO_COST] : async (from, [to]) => {
            await this.costItemRelations.manyLinkedToCost(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TO_PROJECT] : async([from], [to]) => {
            await this.stockRelations.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TO_PRODUCT_ITEM] : async([from], [to]) => {
            await this.stockRelations.linkedToProductItem(
                from,
                to
            )
        },

        [RelationsRule.STOCK_ITEM_TO_PROJECT] : async([from], [to]) => {
            await this.stockItemRelations.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.STOCK_ITEM_TO_NODE] : async([from], [to]) => {
            await this.stockItemRelations.linkedToNode(
                from,
                to
            )
        },

        [RelationsRule.STOCK_ITEM_TO_PRODUCT_ITEM] : async([from], [to]) => {
            await this.stockItemRelations.linkedToProductItem(
                from,
                to
            )
        },

        [RelationsRule.STOCK_ITEM_TO_STOCK] : async([from], [to]) => {
            await this.stockItemRelations.linkedToStock(
                from,
                to
            )
        },

        [RelationsRule.LOT_TO_PROJECT] : async([from], [to]) => {
            await this.lotRelations.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.LOT_TO_NODE] : async([from], [to]) => {
            await this.lotRelations.linkedToNode(
                from,
                to
            )
        },

        [RelationsRule.LOT_TO_PRODUCT_ITEM] : async([from], [to]) => {
            await this.lotRelations.linkedToProductItem(
                from,
                to
            )
        },

        [RelationsRule.LOT_TO_STOCK_ITEM] : async([from], [to]) => {
            await this.lotRelations.linkedToStockItem(
                from,
                to
            )
        },

        [RelationsRule.LOT_TO_RESERVE] : async([from], [to]) => {
            await this.lotRelations.linkedToReserve(
                from,
                to
            )
        },

        [RelationsRule.LOT_TO_COST_SNAPSHOT] : async([from], [to]) => {
            await this.lotRelations.linkedToCostSnapshot(
                from,
                to
            )
        },

        [RelationsRule.LOTS_TO_STOCK_ITEM] : async(from, [to]) => {
            await this.lotRelations.manyLinkedToStockItem(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENT_TO_LOT] : async([from], [to]) => {
            await this.stockMovementRelations.linkedToLot(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENT_TO_NODE] : async([from], [to]) => {
            await this.stockMovementRelations.linkedToNode(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENT_TO_PROJECT] : async([from], [to]) => {
            await this.stockMovementRelations.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENT_TO_STOCK] : async([from], [to]) => {
            await this.stockMovementRelations.linkedToStock(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENT_TO_STOCK_ITEM] : async([from], [to]) => {
            await this.stockMovementRelations.linkedToStockItem(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENT_TO_TRANSFER] : async([from], [to]) => {
            await this.stockMovementRelations.linkedToTransfer(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENT_TO_TRANSFER_ITEM] : async([from], [to]) => {
            await this.stockMovementRelations.linkedToTransferItem(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENT_TO_USER] : async([from], [to]) => {
            await this.stockMovementRelations.linkedToUser(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TRANSFER_TO_PROJECT] : async([from], [to]) => {
            await this.stockTransferRelations.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TRANSFER_TO_NODE] : async([from], [to]) => {
            await this.stockTransferRelations.linkedToNode(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TRANSFER_TO_SOURCE_NODE] : async([from], [to]) => {
            await this.stockTransferRelations.linkedToSourceNode(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TRANSFER_TO_TARGET_NODE] : async([from], [to]) => {
            await this.stockTransferRelations.linkedToTargetNode(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TRANSFER_TO_USER] : async([from], [to]) => {
            await this.stockTransferRelations.linkedToUser(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TRANSFER_ITEM_TO_PROJECT] : async([from], [to]) => {
            await this.stockTransferItemRelations.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TRANSFER_ITEM_TO_NODE] : async([from], [to]) => {
            await this.stockTransferItemRelations.linkedToNode(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TRANSFER_ITEM_TO_TARGET_NODE] : async([from], [to]) => {
            await this.stockTransferItemRelations.linkedToTargetNode(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TRANSFER_ITEM_TO_SOURCE_NODE] : async([from], [to]) => {
            await this.stockTransferItemRelations.linkedToSourceNode(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TRANSFER_ITEM_TO_PRODUCT_ITEM] : async([from], [to]) => {
            await this.stockTransferItemRelations.linkedToProductItem(
                from,
                to
            )
        },

        [RelationsRule.STOCK_TRANSFER_ITEM_TO_TRANSFER] : async([from], [to]) => {
            await this.stockTransferItemRelations.linkedToTransfer(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENTS_LINKER_TO_PROJECT] : async([from], [to]) => {
            await this.stockMovementsLinkerRelations.linkedToProject(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENTS_LINKER_TO_NODE] : async([from], [to]) => {
            await this.stockMovementsLinkerRelations.linkedToNode(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENTS_LINKER_TO_MOVEMENT] : async([from], [to]) => {
            await this.stockMovementsLinkerRelations.linkedToMovement(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENTS_LINKER_TO_SOURCE_MOVEMENT] : async([from], [to]) => {
            await this.stockMovementsLinkerRelations.linkedToSourceMovement(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENTS_LINKER_TO_TARGET_MOVEMENT] : async([from], [to]) => {
            await this.stockMovementsLinkerRelations.linkedToTargetMovement(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENTS_LINKER_TO_TRANSFER_ITEM] : async([from], [to]) => {
            await this.stockMovementsLinkerRelations.linkedToTransferItem(
                from,
                to
            )
        },

        [RelationsRule.STOCK_MOVEMENTS_LINKER_TO_TRANSFER] : async([from], [to]) => {
            await this.stockMovementsLinkerRelations.linkedToTransfer(
                from,
                to
            )
        },

    }

    async runEngine(
        rule: RelationsRule,
        from: any[],
        to: any[]
    ) {
        const handler = this.handlers[rule];
        await handler(from, to);
    }

}