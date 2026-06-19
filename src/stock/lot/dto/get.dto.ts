import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import BaseGetDto from "@/common/models/dto/base-get.dto";
import { LotStatus, LotStatusList, LotType, LotTypeList } from "@/stock/enums/lot.enum";

export default class GetDto extends BaseGetDto {

    @UUIDValidator(
        {
            optional : true
        }
    )
    stockId?: string;
    
    @UUIDValidator(
        {
            optional : true
        }
    )
    stockItemId?: string;

    @EnumValidator(
        {
            values : LotStatusList
        }
    )
    status?: LotStatus;
    
    @EnumValidator(
        {
            values : LotTypeList
        }
    )
    type?: LotType;

}