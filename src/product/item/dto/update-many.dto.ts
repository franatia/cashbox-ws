import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import UpdateDto from "./update.dto";

export default class UpdateManyDto extends UpdateDto {

    @UUIDValidator({
        array : true
    })
    itemsId !: string[];

}