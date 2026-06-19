import { BasicSearchParams } from "@/common/types/params/search-params.type";

export type SearchParams = {

    id ?: string;
    stockId ?: string;
    nodeId ?: string;
    projectId ?: string;

} & BasicSearchParams