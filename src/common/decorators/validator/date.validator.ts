import { IsDateString } from "class-validator";
import { ValidateDecoratorParams } from "./types/params.type";
import { applyBasicDecorators } from "@/common/helpers/validator/class-validator.helper";
import { applyDecorators } from "@nestjs/common";

export type DateValidatorParams = ValidateDecoratorParams

export function DateValidator(
    params : DateValidatorParams = {}
){
    
    const {
        array,
    } = params;

    const decorators : any[] = [
        IsDateString({}, {
            ...(array && {
                each : true
            })
        })
    ]

    applyBasicDecorators(
        decorators,
        params
    )

    return applyDecorators(
        ...decorators
    )

}