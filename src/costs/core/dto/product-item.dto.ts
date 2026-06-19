import { IntValidator } from "@/common/decorators/validator/int.validator";
import { NumberValidator } from "@/common/decorators/validator/number.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";

export default class ProductItemDto {
    
    @UUIDValidator()
    id !: string;

    @NumberValidator({
        min : 0,
        optional : true
    })
    baseCost?: number;
    
    @IntValidator({
        min : 1
    })
    quantity !: number;
}