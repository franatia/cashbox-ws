import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '@/projects/entities/project.entity';
import { Node } from '@/projects/entities/node.entity';
import { CollaboratorRole } from '@/projects/entities/collaborator.entity';
import { AccessRoles } from '@/access/decorators/access.decorator';

@Injectable()
export class AccessService {

  constructor(
    
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Node)
    private readonly nodeRepo: Repository<Node>

  ){

  }

  /**
     * 
     * Crea el query builder de acceso al proyecto
     * 
     * @param projectId 
     * @param userId 
     * @param roles 
     * @param wholeProject 
     * @param throwable 
     * @returns 
     */

  async hasProjectAccess(projectId: string, userId: string, roles: CollaboratorRole[], wholeProject = true, throwable = true) {
    const qb = this.projectRepo
      .createQueryBuilder("project")
      .where("project.id = :projectId", { projectId });

    const ownerSub = qb.subQuery()
      .select("1")
      .from("projects", "p")
      .where("p.id = project.id")
      .andWhere("p.ownerId = :userId")
      .getQuery();

    const collabSubQb = qb.subQuery()
      .select("1")
      .from("collaborators", "c")
      .where("c.projectId = project.id")
      .andWhere("c.userId = :userId")
      .andWhere("c.role IN (:...roles)");

    if (wholeProject) {
      collabSubQb.andWhere("c.nodeId IS NULL");
    }

    const collabSub = collabSubQb.getQuery();

    qb.andWhere(
      new Brackets((qb2) => {
        qb2.where(`EXISTS (${ownerSub})`)
          .orWhere(`EXISTS (${collabSub})`);
      })
    );

    const isExists = await qb
      .setParameters({ userId, roles })
      .getExists();

    if (!isExists && throwable) {
      throw new ForbiddenException("User does not have access to project");
    }

    return isExists;
  }

  /**
   * 
   * Crea el query builder de acceso al nodo
   * 
   * @param nodeId 
   * @param userId 
   * @param roles 
   * @param throwable 
   * @returns 
   */

  async hasNodeAccess(nodeId: string, userId: string, roles: CollaboratorRole[], throwable = true) {

    const qb = this.nodeRepo
      .createQueryBuilder("node")
      .where("node.id = :nodeId", { nodeId });

    const nodeCollaboratorSub = qb.subQuery()
      .select("1")
      .from("collaborators", "c")
      .innerJoin("c.user", "u")
      .where("c.nodeId = node.id")
      .andWhere("u.id = :userId")
      .andWhere("c.role IN (:...roles)")
      .getQuery();

    const ownerSub = qb.subQuery()
      .select("1")
      .from("projects", "project")
      .innerJoin("project.owner", "owner")
      .where("project.id = node.projectId")
      .andWhere("owner.id = :userId")
      .getQuery();

    const globalCollaboratorSub = qb.subQuery()
      .select("1")
      .from("collaborators", "c")
      .innerJoin("c.user", "u")
      .where("c.projectId = node.projectId")
      .andWhere("c.nodeId IS NULL")
      .andWhere("u.id = :userId")
      .andWhere("c.role IN (:...roles)")
      .getQuery();

    qb.andWhere(new Brackets(qb2 => {
      qb2.where(`EXISTS (${nodeCollaboratorSub})`)
        .orWhere(`EXISTS (${ownerSub})`)
        .orWhere(`EXISTS (${globalCollaboratorSub})`)
    }))

    const isExists = await qb.setParameters({
      userId,
      roles
    })
      .getExists();

    if (!isExists && throwable) throw new ForbiddenException("User does not have access to node");

    return isExists;

  }

  /**
     * Verifica si el usuario tiene rol ADMIN en un proyecto.
     *
     * @param projectId - ID del proyecto
     * @param userId - ID del usuario
     * @param wholeProject - Si debe ser un colaborador global del proyecto
     * @param throwable - Si lanza excepción en caso negativo
     * @returns boolean
     */
  
    async hasProjectAdminAccess(projectId: string, userId: string, wholeProject = true, throwable = true) {
  
      return this.hasProjectAccess(projectId, userId, AccessRoles.admin, wholeProject, throwable);
  
    }
  
    /**
     * 
     * Verifica acceso "principal" (ADMIN | MANAGER) a proyecto.
     * 
     * @param projectId 
     * @param userId 
     * @param wholeProject - Si debe ser un colaborador global del proyecto
     * @param throwable 
     * @returns 
     */
  
    async hasProjectMainAccess(projectId: string, userId: string, wholeProject = true, throwable = true) {
  
      return this.hasProjectAccess(projectId, userId, [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER], wholeProject, throwable);
  
    }
  
  
    /**
     * 
     * Verifica acceso básico (ADMIN | MANAGER | EMPLOYEE) al proyecto.
     * 
     * @param projectId 
     * @param userId 
     * @param wholeProject - Si debe ser un colaborador global del proyecto
     * @param throwable 
     * @returns 
     */
  
    async hasProjectLiteAccess(projectId: string, userId: string, wholeProject = true, throwable = true) {
  
      return this.hasProjectAccess(projectId, userId, [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER, CollaboratorRole.EMPLOYEE], wholeProject, throwable);
  
    }
  
    /**
     * 
     * LOS ACCESOS AL NODO YA VERIFICAN SI EL CLIENTE ES COLABORADOR
     * GLOBAL DEL PROYECTO.
     * 
     */
  
    /**
     * 
     * Verifica si el cliente tiene rol ADMIN en el nodo.
     * 
     * @param nodeId 
     * @param userId 
     * @param throwable 
     * @returns 
     */
  
    async hasNodeAdminAccess(nodeId: string, userId: string, throwable = true) {
  
      return this.hasNodeAccess(nodeId, userId, [CollaboratorRole.ADMIN], throwable);
  
    }
  
    /**
     * 
     * Verifica acceso "principal" (ADMIN | MANAGER) al nodo.
     * 
     * @param nodeId 
     * @param userId 
     * @param throwable 
     * @returns 
     */
  
    async hasNodeMainAccess(nodeId: string, userId: string, throwable = true) {
  
      return this.hasNodeAccess(nodeId, userId, [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER], throwable);
  
    }
  
    /**
     * 
     * Verifica acceso básico (ADMIN | MANAGER | EMPLOYEE) al nodo.
     * 
     * @param nodeId 
     * @param userId 
     * @param throwable 
     * @returns 
     */
  
    async hasNodeLiteAccess(nodeId: string, userId: string, throwable = true) {
  
      return this.hasNodeAccess(nodeId, userId, [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER, CollaboratorRole.EMPLOYEE], throwable);
  
    }

}
