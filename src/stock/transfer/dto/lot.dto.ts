import { IntValidator } from "@/common/decorators/validator/int.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";

export default class LotDto {

    @UUIDValidator()
    id !: string;

    @IntValidator({
        min : 1
    })
    quantity !: number;

}