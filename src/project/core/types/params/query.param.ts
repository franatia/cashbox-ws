export type OrmParams = {

    id ?: string;
    name ?: string;
    ownerId ?: string;

}

export type SaveParams = {
    name : string,
    ownerId : string
}

export type UpdateParams = {
    name ?: string
}