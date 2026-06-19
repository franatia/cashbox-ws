import { applyDecorators } from "@nestjs/common"
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ValidateDecoratorParams } from "./types/params.type";
import { applyBasicDecorators } from "@/common/helpers/validator/class-validator.helper";

type StringValidatorParams = {
} & ValidateDecoratorParams

export function StringValidator(
    params: StringValidatorParams = {}
) {

    const {
        array
    } = params;

    const decorators: any[] = [
        IsString({
            ...(array && ({
                each: true
            }))
        }),
        IsNotEmpty()
    ];

    applyBasicDecorators(
        decorators,
        params
    )

    return applyDecorators(
        ...decorators
    )
}