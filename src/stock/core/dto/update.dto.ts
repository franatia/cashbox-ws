import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { IntValidator } from "@/common/decorators/validator/int.validator";
import { Operator, OperatorList } from "@/stock/enums/operator.enum";

export default class UpdateDto {

    @IntValidator({
        min : 0
    })
    quantity !: number;

    @EnumValidator({
        optional : true,
        values : OperatorList
    })
    operator ?: Operator;
}