import { CollaboratorRole } from "@/projects/entities/collaborator.entity";
import { SetMetadata } from "@nestjs/common";

export const ACCESS_CONFIG = "access-config";
export const ACCESS_POLICIES = "access-policies";

export const AccessRoles = {
    admin : [CollaboratorRole.ADMIN],
    manager : [CollaboratorRole.MANAGER],
    employee : [CollaboratorRole.EMPLOYEE],
    main : [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER],
    lite : [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER, CollaboratorRole.EMPLOYEE]
}

export interface AccessConfigMetadata {

    wholeProject ?: boolean, // Whole project sets if the client has to be a general collaborator of project
    freeNull ?: boolean,  // Si no se encuentra el projectId o nodeId en la request, tira error
    firstMatch ?: boolean // Si hay varias policies, con que una se cumpla alcanza

}

export const AtLeastNodeAccess : AccessConfigMetadata = {
    wholeProject : false
};

export const FreeNullAccess : AccessConfigMetadata = {
    freeNull : true
};

export const FirstMatchAccess : AccessConfigMetadata = {
    firstMatch : true
};

export const AccessPolicies = (...policies: Function[]) => SetMetadata(ACCESS_POLICIES, policies);

export const AccessConfig = (...config : AccessConfigMetadata[]) => SetMetadata(ACCESS_POLICIES, Object.assign({}, ...config));