import { BadRequestException } from "@nestjs/common";

export const isEmptyObject = (obj : object) => {

    const entries = Object.entries(obj);
    const values = Object.values(obj);

    return entries.length === 0 || values.every(value => value === undefined);
}

export const notObjectEmpty = (obj : object, message : string = "Object is empty") => {
    const empty = isEmptyObject(obj);

    if(empty){
        throw new BadRequestException(message)
    }
}

export const hasObjectValues = (
    items : any[]
) => {
    const everyObject = items.every(item => typeof item === "object");
    const notEveryObject = items.every(item => typeof item !== "object");

    if(!everyObject && !notEveryObject){
        throw new BadRequestException("Object type values are inconsistent");
    }

    return everyObject;

}

export const range = (start: number, end: number): number[] => {
    return Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
    );
}

const sortAsc = (array: number[]) =>
    [...array].sort((a, b) => a - b);