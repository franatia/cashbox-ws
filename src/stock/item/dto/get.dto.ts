import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import BaseGetDto from "@/common/models/dto/base-get.dto";

export default class GetDto extends BaseGetDto {

    @UUIDValidator(
        {
            optional : true
        }
    )
    stockId ?: string;

}