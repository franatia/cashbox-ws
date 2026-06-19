export type OrmParams  = {
    id ?: string,
    projectId ?: string,
    name ?: string
}

export type SaveParams = {
    projectId : string;
    name : string
}

export type UpdateParams = {
    name ?: string;
}