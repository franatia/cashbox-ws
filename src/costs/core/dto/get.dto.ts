import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { StringValidator } from "@/common/decorators/validator/string.validator";
import BaseGetDto from "@/common/models/dto/base-get.dto";
import { CostAccess, CostAccessList } from "@/costs/enums/access.enum";

export default class GetDto extends BaseGetDto {

    @EnumValidator({
        optional: true,
        values : CostAccessList
    })
    access ?: CostAccess;

    @StringValidator({
        optional : true
    })
    searchText ?: string;

}