import { IsIn, IsOptional } from "class-validator";
import { ValidateDecoratorParams } from "./types/params.type";
import { applyDecorators } from "@nestjs/common";
import { applyBasicDecorators } from "@/common/helpers/validator/class-validator.helper";

type EnumValidatorParams = {
    values : any[]
} & ValidateDecoratorParams

export function EnumValidator(
    params : EnumValidatorParams
){
    
    const {
        values = [],
        array,
    } = params;

    const decorators : any[] = [
        IsIn(values, {
            ...(array && ({
                each : true
            }))
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