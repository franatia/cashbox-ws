import {BaseService} from "@/common/models/crud/base-service.crud";
import { BadRequestException, Injectable } from "@nestjs/common";
import { isEmptyObject } from "@/common/helpers/object.helper";
import CostQuery from "./cost.query";
import RuleEngine from "../rule/engine/rule.engine";
import { CostFactory } from "./cost.factory";
import { RulesTemplateKeys } from "../rule/templates/rule.template";
import { RuleService } from "../rule/rule.service";
import { ItemService } from "../item/item.service";
import { productBaseCostItemTemplate, taxIntegerItemTemplate } from "../item/templates/items.template";
import { CalculateParams, CreateParams, PutParams } from "./types/params/service.params";
import { CalculatePayload } from "./types/payloads/service.payload";

@Injectable()
export default class CostService implements BaseService {

    constructor(
        private readonly query: CostQuery,
        private readonly factory: CostFactory,
        private readonly ruleEngine: RuleEngine,

        private readonly ruleService: RuleService,
        private readonly itemService: ItemService
    ) { }

    /**
     * 
     * HELPERS
     * 
     */

    async calculate(
        params: CalculateParams
    ) : Promise<CalculatePayload> {

        const {
            inputData,
            productItem
        } = params;

        const {
            quantity
        } = productItem;

        const {
            cost,
            seed
        } = await this.ruleEngine.calculateOne({
            productItemParams: productItem,
            inputData: this.factory.mapItemInputDataById(inputData)
        });
        
        return {
            cost,
            quantity,
            unitCost : seed.unitCost,
            seed
        }

    }

    /**
     * 
     * CREATE
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    async create(
        params: CreateParams
    ) {
        const entity = await this.query.saveOne(params);
    
        await this.createDefaultEntities(
            entity.id
        );

        return entity;
    }

    /**
     * 
     * @param costId 
     */

    private async createDefaultEntities(
        costId: string
    ) {

        const { rules } = await this.ruleService.createTemplate(
            costId
        );

        await this.createDefaultItems(
            costId,
            rules
        )

    }

    /**
     * 
     * @param costId 
     * @param rules 
     * @returns 
     */

    private createDefaultItems(
        costId : string,
        rules : Map<string, string>
    ){
        const taxesRuleId = rules.get(
            RulesTemplateKeys.TAXES
        );
        const baseCostRuleId = rules.get(
            RulesTemplateKeys.BASE_COST
        );

        const promises: Promise<any>[] = [];

        if (taxesRuleId) {
            promises.push(
                this.itemService.create({
                    costId,
                    rulesId: [
                        taxesRuleId
                    ],
                    ...taxIntegerItemTemplate
                })
            )
        }

        if(baseCostRuleId){
            promises.push(
                this.itemService.create({
                    costId,
                    rulesId : [
                        baseCostRuleId
                    ],
                    ...productBaseCostItemTemplate
                })
            )
        }

        return Promise.all(promises);
    }

    /**
     * 
     * PUT
     * 
     */

    /**
     * 
     * @param id 
     * @param params 
     */

    async put(
        id: string,
        params: PutParams
    ) {

        const {
            productItemsId,
            ...rest
        } = params

        const promises: Promise<any>[] = [];

        if (!isEmptyObject(rest)) {
            promises.push(this.query.updateOne(id, rest));
        }

        if (productItemsId?.length) {
            promises.push(
                this.query.setProductItems(id, productItemsId)
            );
        }

        if (!promises.length) {
            throw new BadRequestException("No changes occurred")
        }

        await Promise.all(promises);
    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param id 
     * 
     */

    delete(
        id: string
    ) {

        return this.query.deleteOne(id);

    }

}