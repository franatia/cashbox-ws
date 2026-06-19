import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import BaseGetDto from "@/common/models/dto/base-get.dto";
import { ItemType, ItemTypeList } from "@/costs/enums/item.enum";
import { ValueSource, ValueSourceList } from "@/costs/enums/source.enum";
import { CostTag, CostTagList } from "@/costs/enums/tag.enum";

export default class GetDto extends BaseGetDto {

    @UUIDValidator()
    costId !: string;

    @UUIDValidator({
        optional : true
    })
    ruleId ?: string;

    @UUIDValidator({
        optional : true
    })
    constantId ?: string;

    @UUIDValidator({
        optional : true
    })
    taxId ?: string;

    @EnumValidator({
        values : ItemTypeList,
        optional : true
    })
    type ?: ItemType;

    @EnumValidator({
        values : ValueSourceList,
        optional : true
    })
    valueSource ?: ValueSource;

    @EnumValidator({
        values : CostTagList
    })
    tag ?: CostTag

}