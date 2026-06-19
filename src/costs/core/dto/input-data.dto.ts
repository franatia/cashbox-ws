import { NumberValidator } from "@/common/decorators/validator/number.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";

export default class InputDataDto {
    @UUIDValidator()
    id !: string;

    @NumberValidator({
        min : 0
    })
    value !: number;
}