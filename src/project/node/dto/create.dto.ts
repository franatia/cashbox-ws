import { StringValidator } from "@/common/decorators/validator/string.validator";

export class CreateDto {

    @StringValidator()
    name !: string;
    
}