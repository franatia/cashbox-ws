import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { CostTag } from "@/costs/enums/tag.enum";

export type SearchParams = {
    id?: string;
    projectId?: string;
    tag?: CostTag;

    searchText?: string;
} & BasicSearchParams