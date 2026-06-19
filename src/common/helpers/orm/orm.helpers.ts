import { BadRequestException } from "@nestjs/common";

export const parseToArray = (
    value: string
) : string[] => {
    const starts = value.startsWith("{");
    const ends = value.endsWith("}");

    if (!starts || !ends) {
        throw new BadRequestException("Value provided is not postgre array");
    }

    const values = value
        .slice(1, -1)
        .split(",")
        .map(value => value.trim());

    return values;

}