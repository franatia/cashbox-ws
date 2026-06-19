import { BasicSearchParams } from "@/common/types/params/search-params.type";

export type SearchParams = {
    id ?: string;
    projectId ?: string;
    sourceNodeId ?: string;
    targetNodeId ?: string;
    nodeId ?: string;
    userCreatorId ?: string;
} & BasicSearchParams