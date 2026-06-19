import { IsOptional, isUUID, IsUUID, registerDecorator, validateSync, ValidationArguments, ValidationOptions } from "class-validator";
import { ValidateDecoratorParams } from "./types/params.type";
import { ArrayValidator } from "./array.validator";
import { applyDecorators } from "@nestjs/common";
import { applyBasicDecorators } from "@/common/helpers/validator/class-validator.helper";
import { plainToInstance } from "class-transformer";

type UUIDValidatorParams = ValidateDecoratorParams

export function UUIDValidator(
    params: UUIDValidatorParams = {}
) {
    const {
        array
    } = params;

    const decorators: any[] = [
        IsUUID("4", {
            ...(array && ({
                each: true
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

export function UUIDRecordValidator(
    entity: new () => any,
    options: ValidationOptions = {
        message : "Rules are inconsistent"
    },
) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'UUUIDRecordValidator',
            target: object.constructor,
            propertyName,
            constraints: [entity],
            options,
            validator: (value: any, args: ValidationArguments) => {
                
                if (typeof value !== 'object' || value === null) {
                    return false;
                }
                let objectValue = new Object(value);

                const EntityClass = args.constraints[0];

                for (const [key, item] of Object.entries(objectValue)) {
                    if (typeof key === "string") {
                        return false;
                    }

                    const dto = plainToInstance(EntityClass, item);

                    const errors = validateSync(dto);

                    if (errors.length > 0) {
                        return false;
                    }
                }

                return true;
            },
        });
    };
}