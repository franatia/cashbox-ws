import { applyDecorators } from "@nestjs/common";
import { ArrayNotEmpty, IsArray, IsOptional } from "class-validator";
import { ValidateDecoratorParams } from "./types/params.type";
import { ApiProperty } from "@nestjs/swagger";

type ArrayValidatorParams = ValidateDecoratorParams;

export function ArrayValidator(
    params : ArrayValidatorParams = {}
){

    const {
        optional
    } = params;

    const decorators = [
        IsArray(),
        ArrayNotEmpty(),
        ApiProperty()
    ]

    if(optional){
        decorators.push(
            IsOptional()
        )
    }

    return applyDecorators(
        ...decorators
    )
}