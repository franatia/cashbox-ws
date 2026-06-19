import { UUIDValidator } from "@/common/decorators/validator/uuid.validator";
import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { CollaboratorRole, CollaboratorRoleList } from "@/project/enums/roles.enum";

export class CreateDto {

    @UUIDValidator({
        optional : true
    })
    nodeId ?: string;

    @UUIDValidator()
    userId !: string;

    @EnumValidator({
        values : CollaboratorRoleList
    })
    role !: CollaboratorRole;
   
}