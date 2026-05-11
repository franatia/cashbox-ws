import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Brackets, FindOptionsWhere, In, IsNull, Repository } from 'typeorm';
import { Node } from './entities/node.entity';
import { CashboxService } from '@/cashbox/cashbox.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { GetProjectQueryDto } from './dto/get-project-query.dto';
import GetProjectsQueryDto from './dto/get-projects-query.dt';
import GetNodeQueryDto from './dto/get-node-query.dto';
import { Collaborator, CollaboratorRole } from './entities/collaborator.entity';
import UpdateCollaboratorDto from './dto/update-collaborator.dto';
import { AuthService } from '@/auth/auth.service';
import { ParticipationFilter, ProjectServiceQuery } from './query/project.service.query';

type NodeParams = {
  name ?: string
}

type CreateNodesParams = {
  projectId : string;
  nodes : NodeParams[]
}

type CreateCollaboratorParams = {
  projectId : string,
  nodeId ?: string,
  clientId : string,
  userId : string,
  role : CollaboratorRole
}

type GetCollaboratorsParams = {
  nodeId ?: string,
  projectId : string
}

/**
 * ============================================================
 * 🧩 ProjectService
 * ============================================================
 * Servicio central encargado de la gestión de proyectos,
 * nodos y colaboradores dentro del sistema.
 *
 * Responsabilidades:
 * - Control de acceso (RBAC por roles)
 * - Validaciones de integridad entre entidades
 * - CRUD de proyectos, nodos y colaboradores
 * - Orquestación con otros servicios (Auth, Cashbox)
 *
 * Dependencias:
 * - TypeORM Repositories
 * - ProjectServiceQuery (query builder avanzado)
 * - AuthService (validación de usuarios)
 * - CashboxService (creación automática de cajas)
 *
 * Notas:
 * - Se utiliza un enfoque basado en roles:
 *   ADMIN > MANAGER > EMPLOYEE
 * - Se prioriza validación previa a cualquier operación
 */

@Injectable()
export class ProjectService {

  /**
   * ============================================================
   * 🏗️ CONSTRUCTOR & DEPENDENCIES
   * ============================================================
   * Inicializa repositorios y servicios necesarios.
   * Instancia el helper de queries complejas.
   */

  constructor(

    private readonly cashboxService: CashboxService,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    private readonly projectServiceQuery: ProjectServiceQuery,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Node)
    private readonly nodeRepo: Repository<Node>,

    @InjectRepository(Collaborator)
    private readonly collaboratorRepo: Repository<Collaborator>,

  ) { }

  /**
   * 
   * QUERY
   * 
   */

  async isCollaborator(
    userId : string,
    projectId : string,
    nodeId ?: string
  ){
    
    return this.collaboratorRepo.exists({
      where : {
        user : {
          id : userId
        },
        project : {
          id : projectId
        },
        node : {
          id : nodeId ? nodeId : IsNull()
        }
      }
    })

  }

  /**
   * 
   * HELPERS
   * 
   */

  /**
   * 
   * Verifica si el usuario es propietario del proyecto.
   * 
   * @param projectId 
   * @param userId 
   * @returns 
   */

  async isOwnerOfProject(projectId: string, userId: string) {
    return this.projectRepo
      .createQueryBuilder("project")
      .where("project.id = :projectId", { projectId })
      .andWhere("project.ownerId = :userId", { userId })
      .getExists();
  }

  /**
   * 
   * Verifica si el colaborador esta relacionado con el usuario, ya sea si:
   *  1. El usuario es propietario de un proyecto al que el colaborador pertenece.
   *  2. El usuario es colaborador del proyecto al que el colaborador pertenece.
   * 
   * @param collaboratorId 
   * @param userId 
   */

  async collaboratorRelatedToUser(collaboratorId: string, userId: string, throwable: boolean = true) {

    const qb = this.collaboratorRepo.createQueryBuilder("collaborator");
    qb.innerJoin(
      "collaborator.project",
      "project",
    )
    qb.where("collaborator.id = :collaboratorId", { collaboratorId })
      .andWhere(new Brackets(qb => {
        qb.where("project.ownerId = :userId", { userId })
          .orWhere(qb2 => {

            const sub = qb2.subQuery()
              .select("1")
              .from("collaborators", "c")
              .where("c.projectId = project.id")
              .andWhere("c.userId = :userId")
              .getQuery()

            return `EXISTS ${sub}`;

          });
      }))
      .setParameter("userId", userId)
      .getExists();;

    const isExists = await qb.getExists();

    if (!isExists && throwable) throw new BadRequestException("Collaborator does not correspond toward user");

    return isExists;

  }

  /**
   * 
   * Hace el control de acceso para un cliente y colaborador dado, segun si:
   *  1. Envia projectId
   *  2. Envia nodeId
   * 
   * @param clientId 
   * @param collaboratorId 
   * @param projectId 
   * @param nodeId 
   */

  async collaboratorCheckAccess(
    clientId: string,
    collaboratorId: string,
    projectId?: string,
    nodeId?: string
  ) {
    // VALIDACION BASICA
    const himselfRelates = await this.collaboratorLinkedToUser(
      collaboratorId,
      clientId,
      false
    )

    if (himselfRelates) throw new BadRequestException("Can not edit himself");

    // VALIDACION DE ACCESO

    if (!nodeId && !projectId) throw new BadRequestException("nodeId or projectId are required");

    if (nodeId) {
      await this.collaboratorLinkedToNode(collaboratorId, nodeId)
    } else if (projectId) {
      await this.collaboratorLinkedToProject(collaboratorId, projectId);
    }

  }

  /**
   * 
   * 
   * LINKERS HELPERS
   * 
   * 
   */


  /**
   * 
   * Verifica si el nodo pertenece al proyecto.
   * 
   * @param nodeId 
   * @param projectId 
   * @param throwable 
   * @returns 
   */

  async nodeLinkedToProject(nodeId: string, projectId: string, throwable: boolean = true) {

    const isExists = await this.nodeRepo.exists({
      where: {
        id: nodeId,
        project: {
          id: projectId
        }
      }
    })

    if (!isExists && throwable) throw new BadRequestException("Node does not correspond toward project");

    return isExists;

  }


  /**
   * 
   * Verifica si todos los nodos estan relacionados al proyecto.
   * 
   * @param nodeIds 
   * @param projectId 
   * @param throwable 
   * @returns 
   */

  async nodesLinkedToProject(nodeIds: string[], projectId: string, throwable: boolean = true) {

    const count = await this.nodeRepo.count({
      where: {
        id: In(nodeIds),
        project: {
          id: projectId
        }
      }
    })

    const condition = count === nodeIds.length

    if (!condition && throwable) throw new BadRequestException("Nodes not correspond toward project");

    return condition;

  }


  /**
   * 
   * Verifica si el colaborador esta vinculado al id de proyecto dado, es decir
   * si pertenece al proyecto como colaborador.
   * 
   * @param collaboratorId 
   * @param projectId 
   * @param throwable 
   * @returns 
   */

  async collaboratorLinkedToProject(collaboratorId: string, projectId: string, throwable: boolean = true) {
    const isExists = await this.collaboratorRepo.exists({
      where: {
        id: collaboratorId,
        project: {
          id: projectId
        }
      }
    });

    if (!isExists && throwable) throw new BadRequestException("Collaborator does not correspond toward project");

    return isExists

  }

  /**
   * 
   * Verifica si el colaborador esta vinculado al id de nodo dado, es decir,
   * si pertenece al nodo como colaborador.
   * 
   * @param collaboratorId 
   * @param nodeId 
   * @param throwable 
   * @returns 
   */

  async collaboratorLinkedToNode(collaboratorId: string, nodeId: string, throwable: boolean = true) {
    const isExists = await this.collaboratorRepo.exists({
      where: {
        id: collaboratorId,
        node: {
          id: nodeId
        }
      }
    });

    if (!isExists && throwable) throw new BadRequestException("Collaborator does not correspond toward node");

    return isExists

  }

  /**
   * 
   * Verifica si el usuario esta vinculado con el id
   * de colaborador dado. Es decir, buscamos saber si el colaborador
   * y el usuario son las mismas personas.
   * 
   * @param userId 
   * @param collaboratorId 
   * @returns 
   */

  async collaboratorLinkedToUser(collaboratorId : string, userId : string, throwable: boolean = true) {

    const isExists = await this.collaboratorRepo.exists({
      where: {
        id: collaboratorId,
        user: {
          id: userId
        }
      }
    })

    if (!isExists && throwable) throw new BadRequestException("Collaborator does not correspond toward user");

    return isExists;

  }

  async collaboratorNotLinkedToUser(
    id : string,
    userId : string
  ){
    const exists = await this.collaboratorLinkedToUser(
      id,
      userId,
      false
    )

    if(exists){
      throw new BadRequestException("Collaborator is linked with user");
    }

    return exists;
  }

  /**
   * ============================================================
   * 🆕 CREATE (CREACIÓN DE RECURSOS)
   * ============================================================
   * Métodos encargados de la creación de entidades
   * con validaciones previas y lógica adicional.
   */

  /**
   * 
   * Crea un nuevo proyecto y asigna el usuario como propietario.
   * 
   * @param createProjectDto 
   * @param user 
   * @returns 
   */

  async createProject(
    clientId: string,
    createProjectDto: CreateProjectDto
  ): Promise<{
    id: string
  }> {

    const projectDraft = this.projectRepo.create({
      ...createProjectDto,
      owner: { id: clientId }
    })

    const { id } = await this.projectRepo.save(projectDraft);

    return {
      id
    }

  }

  /**
   * 
   * Crea nuevos nodos y los asigna a un proyecto.
   * 
   * IMPORTANTE: El usuario debe ser OWNER o ADMIN del proyecto para crear nodos.
   * 
   * @param createNodesDto 
   * @param user 
   * @returns 
   */

  async createNodes(
    createNodesDto: CreateNodesParams
  ): Promise<{
    ids: string[]
  }> {

    const { nodes, projectId } = createNodesDto;

    const nodeDrafts = this.nodeRepo.create(
      nodes.map(node => ({
        ...node,
        project: {
          id: projectId
        }
      }))
    )

    const ids = (await this.nodeRepo.save(nodeDrafts)).map(n => n.id);

    await this.cashboxService.createSeveralCashboxes(ids, projectId);

    return {
      ids
    }

  }

  /**
   * 
   * Crea un nuevo colaborador y lo asigna a un proyecto o nodo.
   * 
   * @param createCollaboratorDto 
   * @param clientId 
   * @returns 
   */

  async createCollaborator(
    params : CreateCollaboratorParams
  ): Promise<{ id: string }> {

    const {
      projectId,
      nodeId,
      userId,
      clientId,
      ...payload
    } = params;

    /* ================= VALIDACIONES BÁSICAS ================= */

    if (clientId === userId) {
      throw new BadRequestException("User can not be equal to collaborator user");
    }

    const [isOwner, existsUser, isNodeLinked] = await Promise.all([
      this.isOwnerOfProject(projectId, userId),
      this.authService.existsUser(userId),
      (
        nodeId
          ? this.nodeLinkedToProject(nodeId, projectId)
          : Promise.resolve(null)
      )
    ]);

    if (isOwner) {
      throw new BadRequestException("Owner can not be a collaborator");
    }

    if (!existsUser) {
      throw new BadRequestException("User does not exist");
    }

    if (nodeId && !isNodeLinked) {
      throw new BadRequestException("Node does not correspond toward project");
    }

    /* ================= DUPLICADOS ================= */

    const isAlreadyLinked = await this.collaboratorRepo.exists({
      where: [
        // 🔹 Colaborador global del proyecto
        {
          user: { id: userId },
          project: { id: projectId },
          node: IsNull()
        },

        // 🔹 Colaborador del nodo específico
        ...(nodeId
          ? [{
            user: { id: userId },
            node: { id: nodeId }
          }]
          : [])
      ]
    });

    if (isAlreadyLinked) {
      throw new BadRequestException("Collaborator was already added");
    }

    /* ================= CREACIÓN ================= */

    const collaborator = this.collaboratorRepo.create({
      project: { id: projectId },
      ...(nodeId && { node: { id: nodeId } }),
      user: { id: userId },
      ...payload
    });

    const { id } = await this.collaboratorRepo.save(collaborator);

    return { id };
  }

  /**
   * ============================================================
   * ✏️ UPDATE (ACTUALIZACIÓN)
   * ============================================================
   * Métodos para modificación de entidades existentes.
   */

  /**
   * 
   * Actualiza un proyecto existente.
   * 
   * IMPORTANTE: Solo el propietario (owner) o un colaborador con rol ADMIN pueden actualizar un proyecto.
   * 
   * @param id 
   * @param updateProjectDto 
   * @param user 
   */

  async updateProject(
    projectId: string,
    updateProjectDto: UpdateProjectDto
  ) {

    await this.projectRepo.update(projectId, updateProjectDto);

  }

  /**
   * 
   * Actualiza un nodo existente.
   * 
   * IMPORTANTE: Solo el propietario (owner) o un colaborador con rol ADMIN pueden actualizar un nodo.
   * 
   * @param id 
   * @param updateNodeDto 
   * @param user 
   */

  async updateNode(
    nodeId: string,
    updateNodeDto: UpdateNodeDto
  ) {

    return this.nodeRepo.update(nodeId, {
      ...updateNodeDto
    })

  }

  /**
   * 
   * Actualiza un colaborador existente.
   * 
   * IMPORTANTE: Solo el propietario (owner) o un colaborador con rol ADMIN o MANAGER pueden actualizar un colaborador.
   * 
   * @param id 
   * @param updateCollaboratorDto 
   * @param user 
   * @returns 
   */

  async updateCollaborator(
    id : string,
    dto : UpdateCollaboratorDto
  ) {

    const { role } = dto;

    // RETURN

    return this.collaboratorRepo.update(id, {
      role
    })

  }

  /**
   * ============================================================
   * 📦 DELETE (CONSULTAS)
   * ============================================================
   * Métodos de lectura con soporte para:
   * - Filtros dinámicos
   * - Relaciones opcionales
   * - QueryBuilders avanzados
   */


  async deleteProject(
    projectId: string
  ) {

    return this.projectRepo.delete({
      id: projectId
    })

  }

  async deleteNode(
    nodeId: string
  ) {

    return this.nodeRepo.delete({
      id: nodeId
    })

  }

  async deleteCollaborator(
    id : string
  ) {

    return this.collaboratorRepo.delete({
      id
    })

  }

  /**
   * ============================================================
   * 📦 GET (CONSULTAS)
   * ============================================================
   * Métodos de lectura con soporte para:
   * - Filtros dinámicos
   * - Relaciones opcionales
   * - QueryBuilders avanzados
   */

  /**
   * 
   * Obtiene los proyectos donde el usuario es propietario (owner).
   * 
   * @param user 
   * @param query 
   * @returns 
   */

  async getProjectsByOwner(
    clientId: string,
    query: GetProjectsQueryDto
  ) {

    const { selectNodes, selectCollaborators, nodeId } = query;

    const qb = await this.projectServiceQuery.getProjectsQueryBuilder(
      clientId,
      ParticipationFilter.OWNER,
      selectCollaborators,
      selectNodes,
      nodeId
    )

    return qb.getMany();

  }

  /**
   * 
   * Obtiene los proyectos donde el usuario es colaborador (cualquier rol).
   * 
   * IMPORTANTE: No incluye proyectos donde el usuario es propietario (owner), solo colaborador.
   * 
   * @param user 
   * @param query 
   * @returns 
   */

  async getProjectsByCollaborator(
    clientId: string,
    query: GetProjectsQueryDto
  ) {

    const { selectNodes, selectCollaborators, nodeId } = query;

    const qb = await this.projectServiceQuery.getProjectsQueryBuilder(
      clientId,
      ParticipationFilter.COLLABORATOR,
      selectCollaborators,
      selectNodes,
      nodeId
    )


    return qb.getMany();

  }

  /**
   * 
   * Obtiene los proyectos relacionados con el usuario, tanto como propietario (owner) o colaborador.
   * 
   * @param user 
   * @param query 
   * @returns
   */

  async getProjects(
    clientId: string,
    query: GetProjectsQueryDto
  ) {

    return {
      ownProjects: await this.getProjectsByOwner(clientId, query),
      collaboratedProjects: await this.getProjectsByCollaborator(clientId, query)
    }

  }

  /**
   * 
   * Obtiene un proyecto específico.
   * 
   * IMPORTANTE: Si es colaborador de un nodo en especifico y activa selectNodes, 
   * devuelve solo el nodo relacionado con el colaborador, no todos los nodos del proyecto.
   * En el resto de caso, devueve todos.
   * 
   * @param clientId 
   * @param projectId 
   * @param query 
   * @returns 
   */
  
  async getProject(
    clientId: string,
    projectId: string,
    query: GetProjectQueryDto,
  ) {

    const { selectNodes, selectCollaborators } = query;

    const initialQb = this.projectRepo.createQueryBuilder("project")
      .where("project.id = :projectId", { projectId });

    const qb = await this.projectServiceQuery.getProjectsQueryBuilder(
      clientId,
      ParticipationFilter.ALL,
      selectCollaborators,
      selectNodes,
      undefined,
      initialQb
    );

    return qb.getMany();

  }

  /**
   * 
   * Obtiene un nodo específico.
   * 
   * IMPORTANTE: Debe ser propietario (owner), o colaborador del nodo o proyecto para acceder.
   * 
   * @param nodeId 
   * @param query 
   * @param user 
   * @returns 
   */

  async getNode(
    nodeId: string,
    query: GetNodeQueryDto
  ) {

    const { selectProject, selectCollaborators } = query;

    const relations = {
      ...(selectProject && { project: true }),
      ...(selectCollaborators && { collaborators: true })
    }

    const node = await this.nodeRepo.findOne({
      where: {
        id: nodeId
      },
      relations
    })

    return node;

  }

  async getNodes(
    projectId : string,
    dto : GetNodeQueryDto,
    nodeId ?: string,
  ){
    const { selectProject, selectCollaborators } = dto;

    const relations = {
      ...(selectProject && { project: true }),
      ...(selectCollaborators && { collaborators: true })
    }

    const nodes = await this.nodeRepo.find({
      where: {
        ...(nodeId && ({id : nodeId})),
        project : {
          id : projectId
        }
      },
      relations
    })

    return nodes;
  }

  /**
   * 
   * Obtiene los colaboradores de un proyecto o nodo específico.
   * 
   * IMPORTANTE: Debe ser propietario (owner), o colaborador del nodo o proyecto para acceder.
   * 
   * @param query 
   * @param user 
   * @returns 
   */

  async getCollaborators(
    params: GetCollaboratorsParams
  ) {

    const {
      nodeId,
      projectId
    } = params;

    const where : FindOptionsWhere<Collaborator> = {
      project : {
        id : projectId
      },
      ...(nodeId && {
        node : {
          id : nodeId
        }
      })
    }

    return this.collaboratorRepo.find({
      where,
      relations: {
        user: true
      }
    })

  }

  /**
   * 
   * Obtiene un colaborador específico.
   * 
   * IMPORTANTE: Debe estar vinculado al nodo o proyecto del colaborador, ya sea como propietario (owner) o colaborador para acceder.
   * 
   * @param collaboratorId 
   * @param user 
   * @returns 
   */

  async getCollaborator(
    collaboratorId: string
  ) {

    return this.collaboratorRepo.findOne({
      where: {
        id: collaboratorId
      },
      relations: {
        project: true,
        node: true,
        user: true
      }
    })

  }


}
