import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { NumberValidator } from "@/common/decorators/validator/number.validator";
import { StringValidator } from "@/common/decorators/validator/string.validator";
import { CostTag, CostTagList } from "@/costs/enums/tag.enum";

export default class UpdateDto {

    @StringValidator({
        optional : true
    })
    name ?: string;

    @NumberValidator({
        optional : true
    })
    value ?: number;
    
    @EnumValidator({
        values : CostTagList,
        optional : true
    })
    tags ?: CostTag[];

}