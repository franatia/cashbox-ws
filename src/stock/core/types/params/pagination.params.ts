export type CursorPaginationParams = {
    take ?: number;
    lastId ?: string;
}

export type ProjectCursorPaginationParams = {
    projectId : string;
} & CursorPaginationParams