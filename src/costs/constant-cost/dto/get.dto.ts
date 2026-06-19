import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { StringValidator } from "@/common/decorators/validator/string.validator";
import BaseGetDto from "@/common/models/dto/base-get.dto";
import { CostTag, CostTagList } from "@/costs/enums/tag.enum";

export default class GetDto extends BaseGetDto {

    @EnumValidator({
        values : CostTagList,
        optional : true
    })
    tag?: CostTag;
    
    @StringValidator({
        optional : true
    })
    searchText?: string;

}