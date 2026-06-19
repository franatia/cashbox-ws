export type OrmParams = {
    id ?: string;
    transferId ?: string;
    movementsLinkersId ?: string[];
    productItemId ?: string;

    quantity ?: number;
};

export type SaveParams = {
    transferId : string;
    productItemId : string;
    movementsId ?: string[];

    quantity : number;
}