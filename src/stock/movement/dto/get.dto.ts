import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import { OperationDirection, OperationDirectionList } from "@/common/enum/operation.enum";
import BaseGetDto from "@/common/models/dto/base-get.dto";
import { MovementReason, MovementReasonList } from "@/stock/enums/movement.enum";

export default class GetDto extends BaseGetDto {

    @UUIDValidator(
        {
            optional: true
        }
    )
    stockItemId?: string;

    @UUIDValidator(
        {
            optional: true
        }
    )
    lotId?: string;

    @UUIDValidator(
        {
            optional: true
        }
    )
    transferItemId?: string;

    @UUIDValidator(
        {
            optional: true
        }
    )
    orderId?: string;

    @EnumValidator(
        {
            values: OperationDirectionList,
            optional : true
        }
    )
    direction?: OperationDirection;

    @EnumValidator(
        {
            values: MovementReasonList,
            optional : true
        }
    )
    reason?: MovementReason;
    
}