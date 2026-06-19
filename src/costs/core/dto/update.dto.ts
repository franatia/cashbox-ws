import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { StringValidator } from "@/common/decorators/validator/string.validator";
import {UUIDValidator} from "@/common/decorators/validator/uuid.validator";
import { CostAccess, CostAccessList } from "@/costs/enums/access.enum";

export default class UpdateDto {

    @StringValidator({
        optional : true
    })
    name ?: string;

    @EnumValidator({
        optional : true,
        values : CostAccessList
    })
    access ?: CostAccess;

    @UUIDValidator({
        optional : true,
        array : true
    })
    productItemsId ?: string[];

}