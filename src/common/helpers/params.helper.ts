import { BadRequestException } from "@nestjs/common";

export const isEmptyObject = (params : object) => {

    const entries = Object.entries(params);

    return entries.length === 0;
}

export const isEmptyObjectAndThrow = (params : object, message : string = "Search params filters are empty") => {
    const empty = isEmptyObject(params);

    if(empty){
        throw new BadRequestException(message)
    }
}