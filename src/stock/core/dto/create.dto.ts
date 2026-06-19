import { IntValidator } from "@/common/decorators/validator/int.validator";
import { NumberValidator } from "@/common/decorators/validator/number.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";

export default class CreateDto {

    @UUIDValidator()
    productItemId !: string;

}