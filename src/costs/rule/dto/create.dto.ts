import { UUIDRecordValidator, UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import RuleDto from "./rule.dto";
import { StringValidator } from "@/common/decorators/validator/string.validator";

export default class CreateDto {
    
    @StringValidator()
    first !: string;

    @UUIDValidator()
    costId !: string;

    @UUIDRecordValidator(RuleDto)
    rules !: Record<string, RuleDto>;

}