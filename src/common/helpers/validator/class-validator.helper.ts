import { ArrayValidator } from "@/common/decorators/validator/array.validator";
import { ValidateDecoratorParams } from "@/common/decorators/validator/types/params.type";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export const applyBasicDecorators = (
    decorators : (ClassDecorator | MethodDecorator | PropertyDecorator)[],
    params : ValidateDecoratorParams
) :  (ClassDecorator | MethodDecorator | PropertyDecorator)[] => {

    const { 
        array,
        optional
    } = params;

    decorators.push(
        ApiProperty()
    )

    if(array){
        decorators.push(
            ArrayValidator()
        )
    }

    if (optional) {
        decorators.push(
            IsOptional()
        )
    }

    return decorators;

}