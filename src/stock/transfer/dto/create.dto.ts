import { StringValidator } from "@/common/decorators/validator/string.validator";
import { TypeValidator } from "@/common/decorators/validator/type.validator";
import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import ItemDto from "./item.dto";

export default class CreateDto {

    @UUIDValidator()
    targetNodeId !: string;

    @StringValidator({
        optional : true
    })
    description ?: string;

    @TypeValidator(
        () => ItemDto,
        {
            array : true
        }
    )
    items !: ItemDto[];

}