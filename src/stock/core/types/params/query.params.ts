export type OrmParams = {
    id ?: string;
    projectId ?: string;
    productItemId ?: string;
    quantity ?: number;
    totalAmount ?: number;
}

export type SaveParams = {
    projectId : string;
    productItemId : string;
    quantity ?: number;
    totalAmount ?: number;
}

export type UpdateParams = {
    quantity ?: number;
    totalAmount ?: number;
}