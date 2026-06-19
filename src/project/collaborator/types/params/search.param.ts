import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { CollaboratorRole } from "@/project/enums/roles.enum";

export type SearchParams = BasicSearchParams & {

    id ?: string;

    userId ?: string;
    projectId ?: string;
    nodeId ?: string ;

    role ?: CollaboratorRole;

    searchText ?: string;

}