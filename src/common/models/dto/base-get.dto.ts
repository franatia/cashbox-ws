import { IntValidator } from "@/common/decorators/validator/int.validator";
import { Type } from "class-transformer";

export default class BaseGetDto {
    @IntValidator({
        optional : true,
        min: 0
    })
    @Type(() => Number)
    skip: number = 0;

    @IntValidator({
        optional : true,
        min: 1
    })
    @Type(() => Number)
    take: number = 6;
}