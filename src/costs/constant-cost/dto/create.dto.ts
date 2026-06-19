import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { NumberValidator } from "@/common/decorators/validator/number.validator";
import { StringValidator } from "@/common/decorators/validator/string.validator";
import { CostTag, CostTagList } from "@/costs/enums/tag.enum";

export default class CreateDto {

    @StringValidator()
    name !: string;

    @NumberValidator({
        min : 0
    })
    value !: number;

    @EnumValidator({
        values : CostTagList,
        array : true
    })
    tags !: CostTag[];

}