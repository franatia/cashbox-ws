import { IntValidator } from "@/common/decorators/validator/int.validator";
import BaseGetDto from "@/common/models/dto/base-get.dto";

export default class ItemsDto extends BaseGetDto {
    @IntValidator({
        optional : true
    })
    itemsSkip ?: number;

    @IntValidator({
        optional : true
    })
    itemsTake ?: number;
}