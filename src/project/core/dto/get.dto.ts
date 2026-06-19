import { StringValidator } from "@/common/decorators/validator/string.validator";
import BaseGetDto from "@/common/models/dto/base-get.dto";

export class GetDto extends BaseGetDto {

    @StringValidator({
        optional : true
    })
    searchText ?: string

}