import { TypeValidator } from "@/common/decorators/validator/type.validator";
import CreateLotDto from "./create-lot.dto";

export default class CreateLotsDto {

    @TypeValidator(
        () => CreateLotDto,
        {
            array : true
        }
    )
    lots !: CreateLotDto[];

}