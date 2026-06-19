import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { LotStatus, LotType } from "@/stock/enums/lot.enum";

export type SearchParams = {
    
    id ?: string;
    projectId ?: string;
    nodeId ?: string;
    stockId ?: string;
    stockItemId ?: string;
    status ?: LotStatus;
    type ?: LotType;
    reserveId ?: string;
    costSnapshotId ?: string;

} & BasicSearchParams