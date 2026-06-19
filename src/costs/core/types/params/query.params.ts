import { CostAccess } from "@/costs/enums/access.enum";

export type OrmParams = {
    id ?: string;
    name ?: string;
    access ?: CostAccess;
    projectId ?: string;
    productItemsId ?: string[]
}

export type SaveParams = {
    name : string;
    access : CostAccess;
    projectId ?: string;
    productItemsId ?: string[]
}

export type UpdateParams = {
    name ?: string;
    access ?: CostAccess;
}