import { BadRequestException } from "@nestjs/common";

export class CalculationLine {

    readonly line: Record<number, string> = {};
    private _length: number = 0;
    get length(): number {
        return this._length;
    }

    constructor(
        values?: string[]
    ) {
        if (values?.length) {
            this.insertEnd(...values);
        }
    }

    /**
     * 
     * INSERTERS
     * 
     */

    /**
     * 
     * @param values 
     */

    insertEnd(
        ...values: string[]
    ) {
        values.forEach((value, index) => {
            this.line[index + this._length] = value;
        })

        this._length += values.length;

    }

    /**
     * 
     * @param values 
     */

    insertStart(
        ...values: string[]
    ) {
        const length = values.length;

        Object.entries(this.line).forEach(([index, value]) => {
            const normalizedIndex = Number(index);

            this.line[normalizedIndex + length] = value;

            if (normalizedIndex < length) {
                this.line[normalizedIndex] = values[normalizedIndex];
            }
        })

        this._length += length;
    }

    /**
     * 
     * @param index 
     * @param values 
     */

    insertAfter(
        index: number,
        ...values: string[]
    ) {

        const element = this.line[index];

        if (!element) {
            throw new BadRequestException("Element does not exists or is invalid");
        }

        const length = values.length;

        for (const [eIndex, value] of Object.entries(this.line)) {
            const normalizedIndex = Number(eIndex);

            if (normalizedIndex <= index) continue;

            this.line[normalizedIndex + length] = value;

            if (normalizedIndex <= (length + index)) {
                this.line[normalizedIndex] = values[normalizedIndex];
            }

        }

        this._length += length;

    }

    /**
     * 
     * @param value 
     * @returns 
     */

    indexOf(
        value: string
    ) {

        let index = -1;

        for (const [eIndex, element] of Object.entries(this.line)) {

            if (element !== value) continue;

            index = Number(eIndex);
            break;

        }

        return index;

    }

    /**
     * 
     * MODIFIERS
     * 
     */

    /**
     * 
     * @param indexStart 
     * @param indexEnd 
     * @returns 
     */

    slice(
        indexStart : number = 0,
        indexEnd : number = this.length
    ) {

        if (
            indexStart >= indexEnd
        ) {
            throw new BadRequestException("index start and end are inconsistents");
        }

        let pairs: [number, string][] = [];

        for (const [index, element] of Object.entries(this.line)) {

            const nIndex = Number(index);

            if (nIndex < indexStart || nIndex >= indexEnd) continue;

            pairs.push([nIndex, element]);

        }

        pairs = this.sortEntries(pairs);

        return new CalculationLine(
            pairs.map(([_, element]) => element)
        )

    }

    /**
     * 
     * ITERATORS
     * 
     */

    /**
     * 
     * @param cb 
     * 
     */

    forEach(
        cb : (value : string, index : number) => void
    ){

        const entries = this.sortEntries();

        for(const [index, value] of entries){
            cb(value, index);
        }
        
    }

    /**
     * 
     * PRIVATE
     * 
     */

    /**
     * 
     * @param entries 
     * @returns 
     */

    private sortEntries(
        entries : [number, string][] = Object.entries(this.line)
            .map(([key, value]) => [Number(key), value])
    ){
        return entries.sort(([a], [b]) => a - b);
    }

}