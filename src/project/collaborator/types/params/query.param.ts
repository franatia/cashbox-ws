import { CollaboratorRole } from "@/project/enums/roles.enum";

export type OrmParams = {

    id?: string;
    userId?: string;
    projectId?: string;
    nodeId?: string;
    role?: CollaboratorRole

}

export type SaveParams = {

    userId : string;
    nodeId ?: string;
    projectId: string;

    role: CollaboratorRole;

}

export type UpdateParams = {

    role : CollaboratorRole;

}

export type ExistsByContextParams = {

    userId : string;
    projectId ?: string;
    nodeId ?: string;

}