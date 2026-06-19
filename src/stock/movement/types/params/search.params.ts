import { OperationDirection } from "@/common/enum/operation.enum";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { MovementReason } from "@/stock/enums/movement.enum";

export type SearchParams = {
    id ?: string;
    userCreatorId ?: string;
    stockItemId ?: string;
    lotId ?: string;
    transferItemId ?: string;
    orderId ?: string;
    direction ?: OperationDirection;
    reason ?: MovementReason;
    projectId ?: string;
    nodeId ?: string;
} & BasicSearchParams;