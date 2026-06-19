import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import ItemDto from "../item.dto";
import LotDto from "../lot.dto";

type LotQuantityConsistenceParams = {
    quantity : number,
    lots : LotDto[]
}


@ValidatorConstraint({ name: 'LotInfoValidatorConstraint', async: false })
class LotInfoValidatorConstraintClass implements ValidatorConstraintInterface {

    private message = "lotStatus, lotType or lots are required";

    validate(_: any, args: ValidationArguments) {
        const dto = args.object as ItemDto;

        const {
            quantity,
            lots
        } = dto;

        if(lots?.length){
            return this.validateLotQuantityConsistence({
                quantity,
                lots
            })
        }

        return this.validateLotInofExistence(dto);;

    }

    private validateLotInofExistence(
        dto: ItemDto
    ) {

        return (
            dto.lotStatus !== undefined ||
            dto.lotType !== undefined ||
            (dto.lots?.length ?? 0) > 0
        )

    }

    private validateLotQuantityConsistence (
        params: LotQuantityConsistenceParams
    ) {

        const {
            quantity,
            lots
        } = params;

        let lotsQuantity = 0;

        lots.forEach(lot => {
            lotsQuantity += lot.quantity;
        })

        const isValid = quantity === lotsQuantity;

        if(!isValid){
            this.message = "Lots quantity is not equal to transfer item quantity";
        }

        return isValid;

    }

    defaultMessage() {
        return this.message;
    }
}

export function LotInfoValidatorConstraint(
    validationOptions?: ValidationOptions
): ClassDecorator {

    return (target) => {

        registerDecorator({
            name: 'HasLotInfo',
            target,
            propertyName: undefined as never,
            options: validationOptions,
            validator: LotInfoValidatorConstraintClass
        });

    };

}

