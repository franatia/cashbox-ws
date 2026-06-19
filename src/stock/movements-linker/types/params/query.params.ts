export type OrmParams = {
    id ?: string;
    sourceMovementId ?: string;
    targetMovementId ?: string;
    transferItemId ?: string;
    quantity ?: number;
}

export type SaveParams = {
    sourceMovementId : string;
    targetMovementId : string;
    transferItemId : string;
    quantity : number;
}