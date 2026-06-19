import { Type } from "class-transformer";
import { ValidateDecoratorParams } from "./types/params.type";
import { ValidateNested } from "class-validator";
import { applyBasicDecorators } from "@/common/helpers/validator/class-validator.helper";
import { applyDecorators } from "@nestjs/common";

type TypeValidatorParams = ValidateDecoratorParams;

export function TypeValidator<T>(
    cls: () => new (...args: any[]) => T,
    params: TypeValidatorParams = {}
) {

    const {
        array
    } = params;

    const decorators = [
        ValidateNested({
            each: !!array
        }),
        Type(cls)
    ];

    applyBasicDecorators(
        decorators,
        params
    );

    return applyDecorators(
        ...decorators
    );
}