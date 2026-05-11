import { BadRequestException } from "@nestjs/common";
import { BasicSearchParams } from "../interfaces/search-params.interface";

export const isEmpty = <T>(params : BasicSearchParams & T) => {
    const {
        skip,
        take,
        ...rest
    } = params;

    const entries = Object.entries(rest);

    return entries.length === 0;
}

export const isEmptyAndThrow = <T>(params : BasicSearchParams & T, message : string = "Search params filters are empty") => {
    const empty = isEmpty(params);

    if(empty){
        throw new BadRequestException(message)
    }
}