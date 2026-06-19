import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { IntValidator } from "@/common/decorators/validator/int.validator";
import { TypeValidator } from "@/common/decorators/validator/type.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import { type LotTransferStatus, LotTransferStatusList, type LotTransferType, LotTransferTypeList } from "@/stock/transfer-item/types/lot.types";
import LotDto from "./lot.dto";
import { LotInfoValidatorConstraint } from "./decorators/item.decorator.dto";

@LotInfoValidatorConstraint()
export default class ItemDto {

    @IntValidator({
        min : 1
    })
    quantity !: number;

    @UUIDValidator()
    productItemId !: string;

    @EnumValidator({
        values : LotTransferStatusList,
        optional : true
    })
    lotStatus ?: LotTransferStatus;

    @EnumValidator({
        values : LotTransferTypeList,
        optional : true
    })
    lotType ?: LotTransferType

    @TypeValidator(
        () => LotDto,
        {
            array : true,
            optional : true
        }
    )
    lots ?: LotDto[]

}