import { BasicSearchParams } from "@/common/types/params/search-params.type";

export type SearchParams = {
    id ?: string;
    transferId ?: string;
    productItemId ?: string;
    projectId ?: string;
    nodeId ?: string;
} & BasicSearchParams;