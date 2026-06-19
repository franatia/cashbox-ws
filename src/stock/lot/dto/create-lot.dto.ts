import { DateValidator } from "@/common/decorators/validator/date.validator";
import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import CalculateDto from "@/costs/core/dto/calculate.dto";
import { LotStatus, LotStatusList, LotType, LotTypeList } from "@/stock/enums/lot.enum";
import { Type } from "class-transformer";

export default class CreateLotDto extends CalculateDto {

    @UUIDValidator({
        optional : true
    })
    reserveId ?: string;

    @EnumValidator({
        values : LotStatusList
    })
    status !: LotStatus;

    @EnumValidator({
        values : LotTypeList
    })
    type !: LotType;

    @Type(() => Date)
    @DateValidator({
        optional : true
    })
    expiresAt !: Date;

}