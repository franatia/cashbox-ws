import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";

export default class CreateDto {

    @UUIDValidator()
    stockId !: string;

    @UUIDValidator()
    nodeId !: string;
    
}