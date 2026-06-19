import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { IntValidator } from "@/common/decorators/validator/int.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import { OperationDirection, OperationDirectionList } from "@/common/enum/operation.enum";
import { LotStatus, LotStatusList, LotType, LotTypeList } from "@/stock/enums/lot.enum";
import { MovementReason, MovementReasonList } from "@/stock/enums/movement.enum";

export default class CreateDto {

    @IntValidator({
        min : 1
    })
    quantity !: number;
    
    @EnumValidator({
        values : [
            MovementReason.WITHDRAWAL,
            MovementReason.RECEIPT
        ]
    })
    reason !: MovementReason;

    @EnumValidator({
        values : OperationDirectionList
    })
    direction !: OperationDirection;

    @UUIDValidator()
    stockItemId !: string;

    @UUIDValidator({
        optional : true,
        array : true
    })
    lotsId ?: string[]

    @EnumValidator({
        values : LotTypeList,
        optional : true
    })
    lotType ?: LotType;

    @EnumValidator({
        values : LotStatusList,
        optional : true
    })
    lotStatus ?: LotStatus;

}