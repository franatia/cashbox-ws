import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { StringValidator } from "@/common/decorators/validator/string.validator";
import {UUIDValidator} from "@/common/decorators/validator/uuid.validator";
import { CostAccess, CostAccessList } from "@/costs/enums/access.enum";

export default class CreateDto {
    
    @StringValidator()
    name !: string;

    @EnumValidator({
        values : CostAccessList
    })
    access !: CostAccess;

    @UUIDValidator({
        array : true,
        optional : true
    })
    productItemsId ?: string[];

}