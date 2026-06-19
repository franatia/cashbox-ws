import { CostTag } from "@/costs/enums/tag.enum";

export type OrmParams = {
    id ?: string,
    projectId ?: string,
    name ?: string,
    value ?: number,
    tags ?: CostTag[]
}

export type SaveParams = {
    projectId : string;
    name : string;
    value : number;
    tags : CostTag[];
}

export type UpdateParams = {
    name ?: string;
    value ?: number;
    tags ?: CostTag[]
}
