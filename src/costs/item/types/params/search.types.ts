import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { ItemType } from "@/costs/enums/item.enum";
import { ValueSource } from "@/costs/enums/source.enum";
import { CostTag } from "@/costs/enums/tag.enum";

export type SearchParams = {
    id ?: string;
    costId ?: string;
    projectId ?: string;
    rulesId ?: string[];
    constantId ?: string;
    taxId ?: string;

    type ?: ItemType;
    valueSource ?: ValueSource;
    tag ?: CostTag;
} & BasicSearchParams