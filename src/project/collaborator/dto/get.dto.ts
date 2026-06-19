import { EnumValidator } from "@/common/decorators/validator/enum.validator";
import { StringValidator } from "@/common/decorators/validator/string.validator";
import BaseGetDto from "@/common/models/dto/base-get.dto";
import { CollaboratorRole, CollaboratorRoleList } from "@/project/enums/roles.enum";

export class GetDto extends BaseGetDto {

    @EnumValidator({
        values : CollaboratorRoleList,
        optional : true
    })
    role ?: CollaboratorRole;

    @StringValidator({
        optional : true
    })
    searchText ?: string;

}