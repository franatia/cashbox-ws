import { BadRequestException } from "@nestjs/common";
import { BasicSearchParams } from "../../types/params/search-params.type";
import { isEmptyObject } from "../object.helper";

const isEmpty = <T>(params : BasicSearchParams & T) => {
    const {
        skip,
        take,
        ...rest
    } = params;

    return isEmptyObject(rest);
}

export const notSearchParamsEmpty = <T>(params : BasicSearchParams & T, message : string = "Search params filters are empty") => {
    const empty = isEmpty(params);

    if(empty){
        throw new BadRequestException(message)
    }
}