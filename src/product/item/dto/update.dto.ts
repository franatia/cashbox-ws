import { BooleanValidator } from "@/common/decorators/validator/boolean.validator";
import { NumberValidator } from "@/common/decorators/validator/number.validator";
import { StringValidator } from "@/common/decorators/validator/string.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";

export default class UpdateDto {

    @StringValidator({
        optional : true
    })
    name ?: string;

    @NumberValidator({
        optional : true,
        maxDecimalPlaces : 2
    })
    baseCost ?: number;

    @NumberValidator({
        optional : true,
        maxDecimalPlaces : 2
    })
    basePrice ?: number;

    @BooleanValidator()
    webVisibility ?: boolean;

    @UUIDValidator({
        optional : true
    })
    costId ?: string;

}