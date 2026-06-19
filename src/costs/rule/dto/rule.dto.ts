import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import { RuleOperator, RuleOperatorList, RuleTag, RuleTagList } from "@/costs/enums/rule.enum";
import { IsIn } from "class-validator";

export default class RuleDto {

    @IsIn(RuleOperatorList)
    operator !: RuleOperator;

    @EnumValidator({
        values : RuleTagList,
        array : true
    })
    tags !: RuleTag[];

    @UUIDValidator({
        optional : true,
        array : true
    })
    itemsId ?: string[];

    @UUIDValidator({
        optional : true,
        array : true
    })
    parentsId ?: string[];
    
    @UUIDValidator({
        optional : true,
        array : true
    })
    childrenId ?: string[];

}