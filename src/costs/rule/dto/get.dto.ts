import { BooleanValidator } from "@/common/decorators/validator/boolean.validator";
import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import { RuleOperator, RuleOperatorList, RuleTag, RuleTagList } from "@/costs/enums/rule.enum";
import ItemsDto from "./items.dto";

export default class GetDto extends ItemsDto {

    @UUIDValidator({
        optional : true
    })
    costId ?: string;

    @UUIDValidator({
        optional : true
    })
    itemId ?: string;

    @EnumValidator({
        values : RuleTagList,
        optional : true
    })
    tag ?: RuleTag;

    @BooleanValidator({
        optional : true
    })
    first ?: boolean;

    @EnumValidator({
        values : RuleOperatorList,
        optional : true
    })
    operator ?: RuleOperator;

    @UUIDValidator({
        optional : true
    })
    parentId ?: string;

    @UUIDValidator({
        optional : true
    })
    childId ?: string;

}