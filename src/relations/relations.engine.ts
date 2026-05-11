import { ProjectService } from "@/projects/project.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { RelationsRule } from "./decorators/relations.decorator";
import { ProductService } from "@/product/core/product.service";
import { ItemGroupService } from "@/product/item-group/item-group.service";
import { FeatureValuesService } from "@/product/feature-values/feature-values.service";
import { FeatureGroupService } from "@/product/feature-group/feature-group.service";
import { FeaturesService } from "@/product/features/features.service";
import { ItemService } from "@/product/item/item.service";
import { GroupService } from "@/product/group/group.service";
import { ComplementService } from "@/product/complement/complement.service";
import ComposityService from "@/product/composity/composity.service";

type RelationHandler = (from: any[], to: any[]) => Promise<void>;

@Injectable()
export class RelationsEngine {

    constructor(
        private readonly projectService: ProjectService,

        private readonly productService: ProductService,
        private readonly productItemService: ItemService,
        private readonly productGroupService: GroupService,
        private readonly productItemGroupService: ItemGroupService,

        private readonly featuresService: FeaturesService,
        private readonly featureValuesService: FeatureValuesService,
        private readonly featureGroupService: FeatureGroupService,

        private readonly complementService: ComplementService,
        private readonly composityService: ComposityService
    ) { }

    private handlers: Record<RelationsRule, RelationHandler> = {

        [RelationsRule.USER_TO_PROJECT]: async ([from], [to]) => {
            const isOwner = await this.projectService.isOwnerOfProject(
                to,
                from
            );

            if(!isOwner){
                throw new BadRequestException("User is not owner of project")
            }

        },

        "node-project": async ([from], [to]) => {
            await this.projectService.nodeLinkedToProject(
                from,
                to
            );
        },

        "nodes-project": async ([from], [to]) => {
            await this.projectService.nodesLinkedToProject(
                from,
                to
            );
        },

        "collaborator-project": async ([from], [to]) => {
            await this.projectService.collaboratorLinkedToProject(
                from,
                to
            );
        },

        "collaborator-node": async ([from], [to]) => {
            await this.projectService.collaboratorLinkedToNode(
                from,
                to
            );
        },

        "collaborator-user": async ([from], [to]) => {
            await this.projectService.collaboratorLinkedToUser(
                from,
                to
            );
        },

        [RelationsRule.COLLABORATOR_NOT_LINKED_TO_USER] : async ([from], [to]) => {
            await this.projectService.collaboratorNotLinkedToUser(
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
        }

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