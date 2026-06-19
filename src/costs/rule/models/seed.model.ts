import { BadRequestException } from "@nestjs/common";
import { ItemSeed } from "../types/items.types";
import { RuleSeed } from "../types/rule.types";
import { RuleTag } from "@/costs/enums/rule.enum";

export class CostRuleSeed {

    public rulesList : RuleSeed[] = [];
    public itemsList : ItemSeed[] = [];

    constructor(
        public rules : Map<string, RuleSeed> = new Map(),
        public items : Map<string, ItemSeed> = new Map(),
        public quantity : number
    ){
        this.rulesList = Array.from(rules.values());
        this.itemsList = Array.from(items.values());
    }

    get first(){
        const first = this.rulesList.find(rule => (
            rule.first
        ))

        if(!first){
            throw new BadRequestException("First rule is required");
        }

        return first;
    }

    get fixTaxRules(){

        return this.rulesList.filter(rule => (
            rule.tags.includes(RuleTag.FIX_TAX)
        ))

    }

    get taxRules(){

        return this.rulesList.filter(rule => (
            rule.tags.includes(RuleTag.TAX)
        ))

    }

    get specificTaxRules(){

        return this.rulesList.filter(rule => (
            rule.tags.includes(RuleTag.SPECIFIC_TAX)
        ))

    }

    get taxBaseRules(){
        
        return this.rulesList.filter(rule => (
            rule.tags.includes(RuleTag.TAX_BASE)
        ))

    }

    get cost(){
        const first = this.first;

        return first.result.total;
    }

    /**
     * 
     * @returns 
     */

    get unitCost(){
        const cost = this.cost;

        return Math.round((cost / this.quantity) * 100) / 100
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    getById(
        id : string
    ){

        return this.rules.get(id);

    }

    /**
     * 
     * @param id 
     * @returns 
     */

    getByIdOrFail(
        id : string
    ){

        const rule = this.getById(id);

        if(!rule){
            throw new BadRequestException(
                "Rule was not found"
            );
        }

        return rule;

    }

    /**
     * 
     * @param ids 
     * @returns 
     */

    getByIds(
        ids : string[]
    ){

        return this.rulesList.filter(rule => (
            ids.includes(rule.id)
        ))

    }

    /**
     * 
     * @param rule 
     * @returns 
     */

    getParent(
        rule : RuleSeed
    ){

        const {
            parentId
        } = rule;

        if(!parentId){
            throw new BadRequestException(
                "Rule has not parent id"
            )
        }

        return this.getByIdOrFail(parentId);

    }

    getChildren(
        rule : RuleSeed
    ){

        const {
            childrenId
        } = rule;

        if(childrenId?.length){
            throw new BadRequestException(
                "Rule has not childdren id"
            )
        }

        return this.getByIds(childrenId!);

    }

}