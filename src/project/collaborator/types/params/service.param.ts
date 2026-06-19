import { CollaboratorRole } from "@/project/enums/roles.enum";
import { UpdateParams as QueryUpdateParams} from "./query.param";

export type CreateParams = {
    userId : string;
    nodeId ?: string;
    role : CollaboratorRole
};

export type UpdateParams = QueryUpdateParams;