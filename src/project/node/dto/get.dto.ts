import { StringValidator } from "@/common/decorators/validator/string.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import BaseGetDto from "@/common/models/dto/base-get.dto";

export default class GetDto extends BaseGetDto {

    @UUIDValidator(
        {
            optional : true
        }
    )
    cashboxId ?: string;

    @StringValidator(
        {
            optional : true
        }
    )
    searchText ?: string;

    @UUIDValidator(
        {
            optional : true
        }
    )
    projectId ?: string;

}