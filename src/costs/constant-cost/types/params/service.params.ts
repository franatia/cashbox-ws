import { CostTag } from "@/costs/enums/tag.enum";

export type CreateParams = {
    projectId : string;
    name : string;
    value : number;
    tags : CostTag[];
}

export type PutParams = {
    name ?: string;
    value ?: number;
    tags ?: CostTag[];
}