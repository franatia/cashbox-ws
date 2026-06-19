import { BasicSearchParams } from "@/common/types/params/search-params.type";

export type SearchParams = {
    id ?: string;
    transferItemId ?: string;
    sourceMovementId ?: string;
    targetMovementId ?: string;
    projectId ?: string;
    nodeId ?: string;
} & BasicSearchParams;