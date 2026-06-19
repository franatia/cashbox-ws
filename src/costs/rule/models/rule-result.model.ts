import { RuleOperator } from "@/costs/enums/rule.enum";
import { RulePartialResult, RuleResultSource } from "../types/rule.types";
import { BadRequestException } from "@nestjs/common";

export default class RuleResult {

    private _total: number = 0;
    private _partials: RulePartialResult[] = [];

    get total(): number {
        return this._total;
    }

    get partials(): RulePartialResult[] {
        return this._partials;
    }

    constructor(
        private readonly operator: RuleOperator,
        public quantity: number = 1
    ) { }

    /**
     * 
     * CALCULATION
     * 
     */

    /**
     * 
     * @param source 
     * @param cb 
     * @returns 
     */

    private resolveTotalCalculation(
        source: number[],
        cb: (pv: number, cv: number) => number,
        iv: number = 0
    ) {
        return source
            .reduce(
                cb,
                iv
            );
    }

    /**
     * 
     * @param source 
     * @returns 
     */

    private addition(
        source: number[]
    ) {
        return this.resolveTotalCalculation(
            source,
            (pv, cv) => {
                return pv + cv
            }
        );
    }

    /**
     * 
     * @param source 
     * @returns 
     */

    private subtraction(
        source: number[]
    ) {
        return this.resolveTotalCalculation(
            source,
            (pv, cv) => {
                return pv - cv;
            }
        );
    }

    /**
     * 
     * @param source 
     * @returns 
     */

    private multiplication(
        source: number[]
    ) {
        return this.resolveTotalCalculation(
            source,
            (pv, cv) => {
                return pv * cv;
            },
            1
        );
    }

    /**
     * 
     * @param source 
     * @returns 
     */

    private division(
        source: number[]
    ) {
        return this.resolveTotalCalculation(
            source,
            (pv, cv) => {
                return pv * cv;
            },
            1
        );;
    }

    /**
     * 
     * @param source 
     * @returns 
     */

    private summation(
        source: number[]
    ) {

        if (!this.quantity) {
            throw new BadRequestException("To calculate SUMMATION operator, quantity is required");
        }

        const partialsTotal = this.resolveTotalCalculation(
            source,
            (pv, cv) => {
                return pv + cv;
            }
        )

        return partialsTotal * this.quantity;

    }

    /**
     * 
     * @param source 
     * @returns 
     */

    private operate(
        source: number[]
    ) {

        let result = 0;

        switch (this.operator) {
            case RuleOperator.ADDITION:
                result = this.addition(
                    source
                );
                break;
            case RuleOperator.SUBTRACTION:
                result = this.subtraction(
                    source
                );
                break;
            case RuleOperator.MULTIPLICATION:
                result = this.multiplication(
                    source
                );
                break;
            case RuleOperator.DIVISION:
                result = this.division(
                    source
                );
                break;
            case RuleOperator.SUMMATION:
                result = this.summation(
                    source
                );
                break;
        }

        return result;
    }

    private operateOverTotal() {
        const result = this.operate(
            this._partials.map(partial => partial.value)
        );

        this._total = result;
    }

    /**
     * 
     * PRIVATE
     * 
     */
    
    /**
     * 
     * FINDERS
     * 
     */

    /**
     * 
     * @param id 
     * @returns 
     */

    private findChildResult(
        id: string
    ) {
        return this._partials.find(({ id: childId, source }) => (
            childId === id &&
            source === RuleResultSource.CHILD
        ));
    }

    /**
     * 
     * @param cb 
     * @returns 
     */

    private find(
        cb: (item: RulePartialResult) => boolean
    ) {

        let found: RulePartialResult | undefined = undefined;

        for (const partial of this._partials) {
            const match = cb(partial);

            if (match) {
                found = partial;
                break;
            }
        }

        return found;

    }

    /**
     * 
     * MODIFICATORS
     * 
     */

    /**
     * 
     * @param id
     * @param value 
     * @returns 
     */

    private createChild(
        id: string,
        value: number
    ) {
        const result: RulePartialResult = {
            id,
            value,
            source: RuleResultSource.CHILD
        }

        this.addResult(result);
        return result;
    }

    /**
     * 
     * @param result 
     */

    private addResult(
        result: RulePartialResult
    ) {
        this._partials.push(result);
        this.operateOverTotal();
    }

    /**
     * 
     * PUBLIC HELPERS
     * 
     */

    /**
     * 
     * @param cb 
     * @returns 
     */

    some(
        cb: (item: RulePartialResult) => boolean
    ) {

        let some = false;

        for (const partial of this._partials) {
            const match = cb(partial);

            if (!match) continue;

            some = true;
            break;
        }

        return some;

    }

    /**
     * 
     * @param id 
     * @returns 
     */

    hasId(
        id: string
    ) {
        return this._partials.some(({ id: partialId }) => partialId === id)
    }

    /**
     * 
     * PUBLIC METHODS
     * 
     */

    /**
     * 
     * @param values 
     * @returns 
     */

    setItemsResult(
        values: number[]
    ) {
        const source = RuleResultSource.ITEMS;

        const itemResult = this.find(item => item.source === source);
        const resultValue = this.operate(
            values
        );

        if (itemResult) {
            itemResult.value = resultValue;
            return;
        }

        this.addResult({
            source,
            value: resultValue
        })

    }

    /**
     * 
     * @param id 
     * @param value 
     * @returns 
     */

    setChildOrCreate(
        id: string,
        value: number
    ) {
        let result = this.findChildResult(id);

        if (result) {
            if (result.value !== value) {
                result.value = value;
                this.operateOverTotal();
            }
            return;
        };

        this.createChild(
            id,
            value
        )
    }

}