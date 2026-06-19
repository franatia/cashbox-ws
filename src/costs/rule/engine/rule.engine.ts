import { ItemQuery as ProductItemQuery } from "@/product/item/item.query";

import RuleQuery from "../query/rule.query";
import { ProductItemParams, StrictProductItemParams } from "../types/params/product-item.param";
import { CalculateParams, DataSeedParams } from "../types/params/engine.param";
import RuleFactory from "../rule.factory";
import { RuleSeed } from "../types/rule.types";
import { ItemInputData, ItemSeed } from "../types/items.types";
import ItemSearch from "../../item/item.search";
import { ItemContext } from "../types/context.types";
import { Item } from "../../entities/item.entity";
import { BadRequestException, Injectable } from "@nestjs/common";
import { RuleOperator } from "../../enums/rule.enum";
import Rule from "../../entities/rule.entity";
import { CalculationLinesEngine } from "./lines.engine";
import { CostRuleSeed } from "../models/seed.model";
import { CostTag } from "@/costs/enums/tag.enum";
import { ResolveSeedPayload } from "../types/payload/engine.payload";
import { RuleFindQuery } from "../query/rule.find.query";
import { isUUID } from "class-validator";

@Injectable()
export default class RuleEngine {

    constructor(
        private readonly findQuery : RuleFindQuery, 
        private readonly factory: RuleFactory,
        private readonly itemSearch: ItemSearch,

        private readonly productItemQuery: ProductItemQuery,
    ) { }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    private async getCostParams(
        productItemId : string
    ) {

        const { baseCost, cost } = await this.productItemQuery.findOneOrFail({
            where: {
                id : productItemId
            },
            select: ["id","baseCost", "cost"],
            relations : {
                cost : true
            }
        });

        if(!cost){
            throw new BadRequestException(
                "Product item has not some cost linked to proceed with calculation"
            )
        }

        return {
            baseCost,
            cost: cost.id
        };

    }

    /**
     * 
     * @param rules 
     * @param quantity 
     * @returns 
     */

    private getSeedByRules(
        rules: Rule[],
        quantity: number
    ) {
        return rules.map(entity => {
            const seed = this.factory.parseToRuleSeed(entity);

            if (seed.operator === RuleOperator.SUMMATION) {
                seed.result.quantity = quantity
            }

            return seed;
        })
    }

    /**
     * 
     * BUILDERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    private async generateRuleSeed(
        params: StrictProductItemParams
    ): Promise<RuleSeed[]> {

        const {
            costId,
            quantity
        } = params;

        const ruleEntities = await this.findQuery.findByCostIdAndMapRelations(
            costId
        );

        return this.getSeedByRules(
            ruleEntities,
            quantity
        )


    }

    /**
     * 
     * @param ruleSeed 
     * @param inputData 
     * @returns 
     */

    private async generateItemSeed(
        ruleSeed: RuleSeed[],
        inputData: Map<string, ItemInputData>
    ): Promise<ItemSeed[]> {

        const rulesId = ruleSeed.map(rule => rule.id);
        const items = await this.itemSearch.get({
            rulesId
        });

        const itemsContext = this.resolveItemContext(
            items,
            inputData
        )

        return itemsContext.map(context => (
            this.factory.prepareItemSeedFromContext(context)
        ));

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private async generateSeed(
        params: DataSeedParams
    ): Promise<CostRuleSeed> {

        const {
            productItemParams,
            inputData,
        } = params;

        const {
            baseCost
        } = productItemParams;


        const rulesSeed = await this.generateRuleSeed(productItemParams);
        const itemsSeed = await this.generateItemSeed(
            rulesSeed,
            inputData
        );

        this.resolveBaseCostItemSeed(
            baseCost,
            ...itemsSeed
        );

        return new CostRuleSeed(
            this.factory.mapRulesSeedById(rulesSeed),
            this.factory.mapItemsSeedById(itemsSeed),
            productItemParams.quantity
        )

    }

    /**
     * 
     * RESOLVERS
     * 
     */

    /**
     * 
     * @param items 
     * @param inputData 
     * @returns 
     */

    private resolveItemContext(
        items: Item[],
        inputData: Map<string, ItemInputData>
    ): ItemContext[] {

        return items.map(item => {
            const {
                id
            } = item;

            const context: ItemContext = {
                item
            }

            if (inputData.has(id)) {
                context.inputData = inputData.get(id)
            }

            return context;
        })

    }

    /**
     * 
     * @param baseCost 
     * @param itemsSeed 
     */

    private resolveBaseCostItemSeed(
        baseCost: number,
        ...itemsSeed: ItemSeed[]
    ) {
        for (const seed of itemsSeed) {
            if (!seed.tags.includes(CostTag.PRODUCT_BASE_COST)) continue;

            seed.value = baseCost;
            break;
        }
    }

    /**
     * 
     * @param params 
     */

    private async prepareStrictProductItemParams(
        params: ProductItemParams
    ) {
        let {
            id,
            baseCost
        } = params

        const costParams = await this.getCostParams(
            id
        )

        if (!baseCost) {
            params.baseCost = costParams.baseCost;
        }

        return this.factory.parseToStrictProductItemParams({
            ...params,
            costId : costParams.cost as string
        })

    }

    /**
     * 
     * @param seed 
     */

    resolveLinesEngine(
        seed : CostRuleSeed
    ){

        const linesEngine = new CalculationLinesEngine(seed);

        linesEngine.resolve();

        return linesEngine;

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private async resolveSeed(
        params: DataSeedParams
    ) : Promise<ResolveSeedPayload> {

        const seed = await this.generateSeed(params);

        const linesEngine = this.resolveLinesEngine(seed);

        return {
            cost : linesEngine.getCost(),
            seed
        };

    }

    /**
     * 
     * ENDPOINTS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    async calculateOne(
        params: CalculateParams
    ) {

        const {
            productItemParams,
            inputData
        } = params;

        const strictParams = await this.prepareStrictProductItemParams(productItemParams);

        return this.resolveSeed({
            productItemParams : strictParams,
            inputData
        });

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    async calculateMany(
        ...params: CalculateParams[]
    ) {

        const map = new Map<string, ResolveSeedPayload>();

        for (const param of params) {

            const {
                productItemParams: productParam
            } = param;

            const result = await this.calculateOne(param);

            map.set(productParam.id, result);

        }

        return map;
    }

}