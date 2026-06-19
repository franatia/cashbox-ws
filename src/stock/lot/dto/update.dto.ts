import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { IntValidator } from "@/common/decorators/validator/int.validator";
import { LotStatus, LotStatusList } from "@/stock/enums/lot.enum";
import { Operator, OperatorList } from "@/stock/enums/operator.enum";

export default class UpdateDto {

    @IntValidator({
        optional : true,
        min : 1
    })
    quantity ?: number;

    @IntValidator({
        optional : true,
        min : 1
    })
    remaining ?: number;

    @EnumValidator({
        values : LotStatusList,
        optional : true
    })
    status ?: LotStatus;

    @EnumValidator({
        values : OperatorList,
        optional : true
    })
    operator ?: Operator;

}