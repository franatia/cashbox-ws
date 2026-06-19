import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { CollaboratorRole, CollaboratorRoleList } from "@/project/enums/roles.enum";

export class UpdateDto {
    
    @EnumValidator({
        optional: true,
        values : CollaboratorRoleList
    })
    role !: CollaboratorRole;
    
}