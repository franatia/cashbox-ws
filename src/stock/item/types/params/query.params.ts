export type OrmParams = {
    id ?: string;
    stockId ?: string;
    nodeId ?: string;
    quantity ?: number;
    remaining ?: number;
}

export type SaveParams = {
    stockId : string;
    nodeId : string;
    quantity ?: number;
    remaining ?: number;
}

export type UpdateParams = {
    amount ?: number;
    quantity ?: number;
    remaining ?: number;
}