export type OrmParams = {
    id ?: string;
    unitCost ?: number;
    itemsId ?: string[];
    taxSnapshotId ?: string;
}

export type SaveParams = {
    unitCost : number;
}

export type UpdateParams = {
    taxSnapshotId ?: string
}