import { CollaboratorRole } from "@/projects/entities/collaborator.entity";
import { SetMetadata } from "@nestjs/common";

export interface AccessConfigMetadata {

    wholeProject ?: boolean, // Whole project sets if the client has to be a general collaborator of project
    freeNull ?: boolean,  // Si no se encuentra el projectId o nodeId en la request, tira error
    firstMatch ?: boolean // Si hay varias policies, con que una se cumpla alcanza

}

/**
 * 
 * Keys de la metadata
 * 
 */

export const ACCESS_CONFIG = "access-config";
export const ACCESS_POLICIES = "access-policies";

/**
 * 
 * Atajos de roles
 * 
 */

export const AccessRoles = {
    admin : [CollaboratorRole.ADMIN],
    manager : [CollaboratorRole.MANAGER],
    employee : [CollaboratorRole.EMPLOYEE],
    main : [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER],
    lite : [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER, CollaboratorRole.EMPLOYEE]
}

/**
 * 
 * Establece que el usuario debe ser colaborador de al menos un nodo
 * que pertenezca al proyecto, sin necesidad de ser colaborador global
 * 
 */
export const AtLeastNodeAccess : AccessConfigMetadata = {
    wholeProject : false
};

/**
 * 
 * Establece que si no se recibe nodeId o projectId continue
 * la ejecucion. Sirve tambien para un dto con id's opcionales,
 * donde al menos uno debe enviarse
 * 
 */

export const FreeNullAccess : AccessConfigMetadata = {
    freeNull : true
};

/**
 * 
 * Sirve para concluir el guard de acceso comprobando
 * la primer policie correcta
 * 
 */

export const FirstMatchAccess : AccessConfigMetadata = {
    firstMatch : true
};

/**
 * 
 * Establece la metadata que aloja las policies
 * 
 * @param policies 
 * @returns 
 */

export const AccessPolicies = (...policies: Function[]) => SetMetadata(ACCESS_POLICIES, policies);

/**
 * 
 * Establece la metadata que indica de que manera se ejecutaran
 * las policies
 * 
 * @param config 
 * @returns 
 */

export const AccessConfig = (...config : AccessConfigMetadata[]) => SetMetadata(ACCESS_POLICIES, Object.assign({}, ...config));