import { IsInt, IsNumber, Max, Min } from "class-validator";
import { ValidateDecoratorParams } from "./types/params.type";
import { applyBasicDecorators } from "@/common/helpers/validator/class-validator.helper";
import { applyDecorators } from "@nestjs/common";

type NumberValidatorParams = {
    min ?: number
    max ?: number
    maxDecimalPlaces ?: number
} & ValidateDecoratorParams

export function NumberValidator(
    params : NumberValidatorParams = {}
){
    const {
        array,
        max,
        min,
        maxDecimalPlaces = 2
    } = params;

    const decorators : any[] = [
        IsNumber({maxDecimalPlaces}, {
            ...(array && ({
                each  : true
            }))
        })
    ]

    if(max !== undefined && max !== null){
        decorators.push(
            Max(max)
        )
    }

    if(min !== undefined && min !== null){
        decorators.push(
            Min(min)
        )
    }

    applyBasicDecorators(
        decorators,
        params
    )

    return applyDecorators(
        ...decorators
    )

}