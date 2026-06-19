import { IsInt, Max, Min } from "class-validator";
import { ValidateDecoratorParams } from "./types/params.type";
import { applyBasicDecorators } from "@/common/helpers/validator/class-validator.helper";
import { applyDecorators } from "@nestjs/common";

type IntValidatorParams = {
    min ?: number
    max ?: number
} & ValidateDecoratorParams

export function IntValidator(
    params : IntValidatorParams = {}
){
    const {
        array,
        max,
        min,
    } = params;

    const decorators : any[] = [
        IsInt({
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