import { applyBasicDecorators } from "@/common/helpers/validator/class-validator.helper";
import { ValidateDecoratorParams } from "./types/params.type";
import { IsBoolean } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { Type } from "class-transformer";

type BooleanValidatorParams = ValidateDecoratorParams

export function BooleanValidator(
    params : BooleanValidatorParams = {}
){
    
    const {
        array,
    } = params;

    const decorators : any[] = [
        IsBoolean({
            ...(array && ({
                each: true
            }))
        }),
        Type(() => Boolean)
    ]

    applyBasicDecorators(
        decorators,
        params
    )

    return applyDecorators(
        ...decorators
    )

}