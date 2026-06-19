import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import { RuleOperator, RuleOperatorList, RuleTag, RuleTagList } from "@/costs/enums/rule.enum";

export default class UpdateDto {
    
    @EnumValidator({
        values : RuleOperatorList,
        optional : true
    })
    operator ?: RuleOperator;

    @EnumValidator({
        values : RuleTagList,
        optional : true,
        array : true
    })
    tags ?: RuleTag[]

    @UUIDValidator({
        optional : true,
        array : true
    })
    parentsId ?: string[];

    @UUIDValidator({
        optional : true,
        array : true
    })
    itemsId ?: string[];

}