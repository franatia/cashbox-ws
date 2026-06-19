import { BadRequestException } from "@nestjs/common";
import { CalculationLine } from "../models/calculation-line.model";
import { LinePairPayload } from "../types/payload.types";
import { RuleResultSource, RuleSeed } from "../types/rule.types";
import { CostRuleSeed } from "../models/seed.model";
import { ItemSeed } from "../types/items.types";

enum OrderType {
    ASC = "ASC",
    DESC = "DESC"
}

export class CalculationLinesEngine {

    private _lines: CalculationLine[] = [];

    constructor(
        private readonly seed: CostRuleSeed
    ) { }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param order 
     */

    sortLinesByLength(
        order: OrderType
    ) {
        switch (order) {
            case OrderType.ASC:
                this._lines.sort((a, b) => a.length - b.length);
                break;
            case OrderType.DESC:
                this._lines.sort((a, b) => b.length - a.length);
                break;
        }
    }

    /**
     * 
     * @param itemsId 
     * @param items 
     * @returns 
     */

    private getItemValues(
        itemsId: string[],
        items: Map<string, ItemSeed>
    ) {

        const values: number[] = [];

        for (const itemId of itemsId) {
            const itemSeed = items.get(itemId);

            if (itemSeed === undefined) continue;
            values.push(itemSeed.value);
        }

        return values;

    }

    /**
     * 
     * BUILDERS
     * 
     */

    /**
     * 
     * @param rulesMap 
     * @returns 
     */

    private buildPairs(
        rulesMap: Map<string, RuleSeed>
    ): LinePairPayload[] {
        const rules = Array.from(rulesMap.values());

        return rules.flatMap(({
            id,
            parentId
        }) => (

            (parentId) ? ({
                itemId: id,
                parentId
            }) : []

        ))
    }

    /**
     * 
     * @param itemId 
     * @param parentId 
     */

    private createCalculationLine(
        itemId: string,
        parentId?: string,
    ) {
        const values = [itemId];
        if (parentId) {
            values.push(parentId);
        }

        this._lines.push(
            new CalculationLine(
                values
            )
        )
    }

    /**
     * 
     * @param seed 
     */

    private generateCalculationLines() {

        const {
            rules
        } = this.seed;

        const pairs = this.buildPairs(
            rules
        )

        for (const { itemId, parentId } of pairs) {

            this.resolvePair(
                itemId,
                parentId
            )

        }

        this.sortLinesByLength(
            OrderType.DESC
        )

    }

    /**
     * 
     * UPDATERS
     * 
     */

    /**
     * 
     * @param line 
     * @param itemIndex 
     * @param parentId 
     * @returns 
     */

    private updateItemLine(
        line: CalculationLine,
        itemIndex: number,
        parentId: string,
    ) {

        const lineSize = line.length;

        let update = false;

        if (itemIndex < lineSize - 1) {
            const newLine = line.slice(
                0,
                itemIndex + 1
            );

            newLine.insertEnd(parentId);

            this._lines.push(newLine);

            update = true;

        }
        if (itemIndex === lineSize - 1) {

            line.insertEnd(parentId);

            update = true;

        }

        return update;

    }

    /**
     * 
     * @param line 
     * @param parentIndex 
     * @param itemId 
     * @returns 
     */

    private updateParentLine(
        line: CalculationLine,
        parentIndex: number,
        itemId: string,
    ) {

        const lineSize = line.length;

        let update = false;

        if (parentIndex === 0) {

            line.insertStart(itemId);

            update = true;

        }
        else if (parentIndex < lineSize - 1) {

            const newLine = line.slice(
                parentIndex
            );

            newLine.insertStart(itemId);

            this._lines.push(newLine);

            update = true;
        }

        return update;
    }

    /**
     * 
     * RESOLVERS
     * 
     */

    /**
     * 
     * @param line 
     * @param itemId 
     * @param parentId 
     * @returns 
     */

    private resolveLine(
        line: CalculationLine,
        itemId: string,
        parentId?: string
    ) {
        const parentIndex = (parentId) ? line.indexOf(parentId) : -1;
        const itemIndex = line.indexOf(itemId);

        let update = false;

        if (itemIndex - 1 === parentIndex) return update;

        if (
            itemIndex < 0 &&
            parentIndex >= 0
        ) {
            update = this.updateParentLine(
                line,
                parentIndex,
                itemId
            )
        }

        if (
            parentIndex < 0 &&
            itemIndex >= 0 &&
            parentId
        ) {
            update = this.updateItemLine(
                line,
                itemIndex,
                parentId
            )
        }

        return update;
    }

    /**
     * 
     * @param itemId 
     * @param parentId 
     */

    private resolvePair(
        itemId: string,
        parentId?: string
    ) {

        let update = false;

        for (const line of this._lines) {

            const updated = this.resolveLine(
                line,
                itemId,
                parentId
            )

            if (updated && !update) {
                update = true;
            }

        }

        if (!update) {
            this.createCalculationLine(
                itemId,
                parentId
            )
        }

    }

    /**
     * 
     * @param rule 
     * @returns 
     */

    private resolveItemsResult(
        rule: RuleSeed
    ) {

        const {
            items
        } = this.seed;

        const {
            result,
            itemsId
        } = rule;

        const has = result.some(
            item => item.source === RuleResultSource.ITEMS
        );

        if (has || !itemsId?.length) return;

        const itemValues = this.getItemValues(
            itemsId,
            items
        )

        result.setItemsResult(
            itemValues
        )

    }

    /**
     * 
     * @param rule 
     * @returns 
     */

    private resolveChildrenResults(
        rule: RuleSeed
    ) {

        const {
            rules
        } = this.seed;

        const {
            result,
            childrenId
        } = rule;

        if (!childrenId?.length) return;

        for (const childId of childrenId) {

            const childRule = rules.get(childId);

            if (!childRule) {
                throw new BadRequestException("Any child rule does not exists");
            }

            const {
                id,
                result: childResult
            } = childRule;

            result.setChildOrCreate(
                id,
                childResult.total
            )

        }

    }

    /**
     * 
     * CALCULATORS
     * 
     */

    /**
     * 
     * @param ruleId 
     * @param seed 
     */

    private calculateRuleSeed(
        ruleId: string
    ) {
        const {
            rules
        } = this.seed;

        const rule = rules.get(ruleId);

        if (!rule) {
            throw new BadRequestException("Rule id does not exists inside rule seed map");
        }

        this.resolveItemsResult(
            rule
        )

        this.resolveChildrenResults(
            rule
        )
    }

    /**
     * 
     * @param seed 
     */

    private calculateLines() {

        for (const line of this._lines) {

            line.forEach(
                (value) => {
                    this.calculateRuleSeed(
                        value
                    )
                }
            )

        }

    }

    resolve() {

        this.generateCalculationLines();

        this.calculateLines()

    }

    getCost() {
        return this.seed.cost;
    }

}