import { BasicSearchParams } from "@/common/types/params/search-params.type";

export type SearchParams = BasicSearchParams & {

    id ?: string;
    projectId ?: string;
    cashboxId ?: string;

    searchText ?: string;

}