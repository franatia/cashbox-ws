import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { NumberValidator } from "@/common/decorators/validator/number.validator";
import { StringValidator } from "@/common/decorators/validator/string.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import { ItemType, ItemTypeList } from "@/costs/enums/item.enum";
import { ValueSource, ValueSourceList } from "@/costs/enums/source.enum";
import { CostTag, CostTagList } from "@/costs/enums/tag.enum";

export default class UpdateDto {
    
    @StringValidator({
        optional : true
    })
    name ?: string;

    @EnumValidator({
        optional : true,
        values : ItemTypeList
    })
    type ?: ItemType;

    @EnumValidator({
        optional : true,
        values : ValueSourceList
    })
    valueSource ?: ValueSource;

    @NumberValidator({
        optional : true,
        min : 0
    })
    defaultValue ?: number;

    @EnumValidator({
        optional : true,
        values : CostTagList,
        array : true
    })
    tags ?: CostTag[];

    @UUIDValidator({
        optional : true
    })
    constantId ?: string;

    @UUIDValidator({
        optional : true
    })
    taxId ?: string;

}