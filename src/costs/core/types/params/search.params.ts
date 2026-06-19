import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { CostAccess } from "@/costs/enums/access.enum";

export type SearchParams = {
    id?: string;
    projectId?: string;
    access?: CostAccess;

    searchText?: string;
} & BasicSearchParams