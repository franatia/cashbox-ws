import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Brackets, DataSource, In, IsNull, Repository } from 'typeorm';
import { Node } from './entities/node.entity';
import { CreateNodesDto } from './dto/create-nodes.dto';
import { CashboxService } from '@/cashbox/cashbox.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { GetProjectQueryDto } from './dto/get-project-query.dto';
import GetProjectsQueryDto from './dto/get-projects-query.dt';
import GetNodeQueryDto from './dto/get-node-query.dto';
import CreateCollaboratorDto from './dto/create-collaborator.dto';
import { Collaborator, CollaboratorRole } from './entities/collaborator.entity';
import UpdateCollaboratorDto from './dto/update-collaborator.dto';
import GetCollaboratorsQueryDto from './dto/get-collaborators-query.dto';
import { AuthService } from '@/auth/auth.service';
import { ParticipationFilter, ProjectServiceQuery } from './query/project.service.querty';

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

    private readonly authService: AuthService,

    private readonly projectServiceQuery: ProjectServiceQuery,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Node)
    private readonly nodeRepo: Repository<Node>,

    @InjectRepository(Collaborator)
    private readonly collaboratorRepo: Repository<Collaborator>,

    private readonly dataSource: DataSource,

  ) { }

  /**
   * ============================================================
   * 🔐 VERIFY (CONTROL DE ACCESO & VALIDACIONES)
   * ============================================================
   * Métodos encargados de:
   * - Validar permisos de usuario sobre proyectos/nodos
   * - Verificar relaciones entre entidades
   * - Evitar accesos indebidos
   */

  /**
   * Verifica si el usuario tiene rol ADMIN en un proyecto.
   *
   * @param projectId - ID del proyecto
   * @param userId - ID del usuario
   * @param throwable - Si lanza excepción en caso negativo
   * @returns boolean
   */

  async hasProjectAdminAccess(projectId: string, userId: string, wholeProject = true, throwable = true) {

    return this.projectServiceQuery.hasProjectAccess(projectId, userId, [CollaboratorRole.ADMIN], wholeProject, throwable);

  }

  /**
   * Verifica acceso "principal" (ADMIN | MANAGER) a proyecto.
   *
   * Uso típico:
   * - Edición de proyecto
   * - Gestión de colaboradores
   */

  async hasProjectMainAccess(projectId: string, userId: string, wholeProject = true, throwable = true) {

    return this.projectServiceQuery.hasProjectAccess(projectId, userId, [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER], wholeProject, throwable);

  }

  /**
   * Verifica acceso básico (ADMIN | MANAGER | EMPLOYEE).
   *
   */

  async hasProjectLiteAccess(projectId: string, userId: string, wholeProject = true, throwable = true) {

    return this.projectServiceQuery.hasProjectAccess(projectId, userId, [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER, CollaboratorRole.EMPLOYEE], wholeProject, throwable);

  }

  /**
   * Verifica acceso "principal" (ADMIN | MANAGER) al nodo.
   *
   */

  async hasNodeAdminAccess(nodeId: string, userId: string, throwable = true) {

    return this.projectServiceQuery.hasNodeAccess(nodeId, userId, [CollaboratorRole.ADMIN], throwable);

  }

  async hasNodeMainAccess(nodeId: string, userId: string, throwable = true) {

    return this.projectServiceQuery.hasNodeAccess(nodeId, userId, [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER], throwable);

  }

  async hasNodeLiteAccess(nodeId: string, userId: string, throwable = true) {

    return this.projectServiceQuery.hasNodeAccess(nodeId, userId, [CollaboratorRole.ADMIN, CollaboratorRole.MANAGER, CollaboratorRole.EMPLOYEE], throwable);

  }

  /*

    Verifica si el usuario es el propietario del proyecto (owner).
  
  */

  async isOwnerOfProject(projectId: string, userId: string) {
    return this.projectRepo
      .createQueryBuilder("project")
      .where("project.id = :projectId", { projectId })
      .andWhere("project.owner.id = :userId", { userId })
      .getExists();
  }

  async userRelatedToCollaborator(userId : string, collaboratorId : string) {

    return this.collaboratorRepo.exists({
      where : {
        id : collaboratorId,
        user : {
          id:  userId
        }
      }
    })

  }

  /*

    Verifica si el nodo pertenece al proyecto.
  
  */

  async nodeLinkedToProject(nodeId: string, projectId: string) {

    const isExists = await this.nodeRepo.exists({
      where: {
        id: nodeId,
        project: {
          id: projectId
        }
      }
    })

    if (!isExists) throw new BadRequestException("Node does not correspond toward project");

  }

  /*
  
    Verifica si los nodos pertenecen al proyecto
  
  */

  async nodesLinkedToProject(nodeIds: string[], projectId: string) {

    const count = await this.nodeRepo.count({
      where: {
        id: In(nodeIds),
        project: {
          id: projectId
        }
      }
    })

    if (count !== nodeIds.length) throw new BadRequestException("Nodes not correspond toward project");

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

  async collaboratorLinkedToUser(collaboratorId: string, userId: string) {

    console.log(collaboratorId, userId);

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

    if (!isExists) throw new BadRequestException("Collaborator does not correspond toward user");

  }

  /**
   * 
   * Verifica si el colaborador pertenece al proyecto
   * 
   */

  async collaboratorLinkedToProject(collaboratorId: string, projectId: string, throwable : boolean = true) {
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
   * Verifica si el colaborador pertenece al nodo
   * 
   */

  async collaboratorLinkedToNode(collaboratorId: string, nodeId: string, throwable : boolean = true) {
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

  async createProject(createProjectDto: CreateProjectDto, user: string): Promise<{
    id: string
  }> {

    const projectDraft = this.projectRepo.create({
      ...createProjectDto,
      owner: { id: user }
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
    createNodesDto: CreateNodesDto,
    user: string
  ): Promise<{
    ids: string[]
  }> {

    const { nodes, projectId } = createNodesDto;

    await this.hasProjectAdminAccess(projectId, user)

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
   * @param user 
   * @returns 
   */

  async createCollaborator(
    createCollaboratorDto: CreateCollaboratorDto,
    user: string
  ): Promise<{ id: string }> {

    const {
      projectId,
      nodeId,
      user: collaboratorUser,
      ...payload
    } = createCollaboratorDto;

    /* ================= VALIDACIONES BÁSICAS ================= */

    if (user === collaboratorUser) {
      throw new BadRequestException("User can not be equal to collaborator user");
    }

    const [isOwner, existsUser] = await Promise.all([
      this.isOwnerOfProject(projectId, collaboratorUser),
      this.authService.existsUser(collaboratorUser)
    ]);

    if (isOwner) {
      throw new BadRequestException("Owner can not be a collaborator");
    }

    if (!existsUser) {
      throw new BadRequestException("User does not exist");
    }

    /* ================= CONTROL DE ACCESO ================= */

    if (nodeId) {
      await Promise.all([
        this.nodeLinkedToProject(nodeId, projectId),
        this.hasNodeMainAccess(nodeId, user)
      ]);
    } else {
      await this.hasProjectMainAccess(projectId, user);
    }

    /* ================= DUPLICADOS ================= */

    const isAlreadyLinked = await this.collaboratorRepo.exists({
      where: [
        // 🔹 Colaborador global del proyecto
        {
          user: { id: collaboratorUser },
          project: { id: projectId },
          node : IsNull()
        },

        // 🔹 Colaborador del nodo específico
        ...(nodeId
          ? [{
            user: { id: collaboratorUser },
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
      user: { id: collaboratorUser },
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
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: string
  ) {

    await this.hasProjectAdminAccess(id, user);

    await this.projectRepo.update(id, updateProjectDto);

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
    id: string,
    updateNodeDto: UpdateNodeDto,
    user: string
  ) {
    await this.hasNodeAdminAccess(id, user);

    return this.nodeRepo.update(id, {
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
    id: string,
    updateCollaboratorDto: UpdateCollaboratorDto,
    user: string
  ) {

    const { projectId, nodeId, role } = updateCollaboratorDto;

    // VALIDACION BASICA

    if (!projectId && !nodeId) throw new BadRequestException("ProjectId and NodeId are required");

    const himselfRelates = await this.userRelatedToCollaborator(
      user,
      id
    )

    if(himselfRelates) throw new BadRequestException("Can not edit himself");

    // VALIDACION DE ACCESO

    if (projectId) {
      await Promise.all([
        this.collaboratorLinkedToProject(id, projectId),
        this.hasProjectAdminAccess(projectId, user)
      ])
    };

    if (nodeId) {
      await Promise.all([
        this.collaboratorLinkedToNode(id, nodeId),
        this.hasNodeAdminAccess(nodeId, user)
      ]);
    };

    // RETURN

    return this.collaboratorRepo.update(id, {
      role
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
    user: string,
    query: GetProjectsQueryDto
  ) {

    const { selectNodes, selectCollaborators, nodeSelector } = query;

    const qb = await this.projectServiceQuery.getProjectsQueryBuilder(
      user,
      ParticipationFilter.OWNER,
      selectCollaborators,
      selectNodes,
      nodeSelector
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
    user: string,
    query: GetProjectsQueryDto
  ) {

    const { selectNodes, selectCollaborators, nodeSelector } = query;

    const qb = await this.projectServiceQuery.getProjectsQueryBuilder(
      user,
      ParticipationFilter.COLLABORATOR,
      selectCollaborators,
      selectNodes,
      nodeSelector
    )


    return qb.getMany();

  }

  /**
   * 
   * Obtiene los proyectos relacionados con el usuario, tanto como propietario (owner) o colaborador.
   * 
   * @param user 
   * @param query 
   * @returns {
   *  ownProjects: Project[],
   *  collaboratedProjects: Project[]
   * }
   */

  async getProjects(
    user: string,
    query: GetProjectsQueryDto
  ) {

    const { nodeSelector } = query;

    if (nodeSelector) await this.hasNodeLiteAccess(nodeSelector, user);

    return {
      ownProjects: await this.getProjectsByOwner(user, query),
      collaboratedProjects: await this.getProjectsByCollaborator(user, query)
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
   * 
   * @param projectId 
   * @param user 
   * @param query 
   * @returns 
   */

  async getProject(
    projectId: string,
    user: string,
    query: GetProjectQueryDto,
  ) {

    await this.hasProjectLiteAccess(projectId, user, false);

    const { selectNodes, selectCollaborators } = query;

    const initialQb = this.projectRepo.createQueryBuilder("project")
      .where("project.id = :projectId", { projectId });

    const qb = await this.projectServiceQuery.getProjectsQueryBuilder(
      user,
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
   * Obtiene un proyecto y un nodo específico.
   * 
   * IMPORTANTE: Debe ser propietario (owner), o colaborador del nodo o proyecto para acceder.
   * 
   * @param projectId 
   * @param user 
   * @param nodeId 
   * @returns 
   */

  async getProjectAndNode(
    projectId: string,
    user: string,
    nodeId: string,
  ) {

    await this.nodeLinkedToProject(nodeId, projectId);
    await this.hasNodeLiteAccess(nodeId, user);

    const qb = this.projectRepo.createQueryBuilder("project");

    qb.innerJoinAndSelect(
      'project.nodes',
      'node',
      'node.id= :nodeId',
      { nodeId }
    );

    qb.leftJoinAndSelect(
      "node.collaborators",
      "nodeCollaborators",
    );

    qb.leftJoinAndSelect(
      "project.collaborators",
      "projectCollaborators"
    )

    qb.where("project.id = :projectId", { projectId });

    return qb.getOne();

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
    query: GetNodeQueryDto,
    user: string
  ) {

    await this.hasNodeLiteAccess(nodeId, user);

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
    query: GetCollaboratorsQueryDto,
    user: string
  ) {

    const { projectSelector, nodeSelector } = query;

    if (!projectSelector && !nodeSelector) throw new BadRequestException("ProjectSelector or NodeSelector is required");

    //TODO : OPTIMIZE

    if (projectSelector) await this.hasProjectLiteAccess(projectSelector, user);

    if (nodeSelector) await this.hasNodeLiteAccess(nodeSelector, user);

    const where = {
      ...(projectSelector && { project: { id: projectSelector } }),
      ...(nodeSelector && { node: { id: nodeSelector } })
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
    collaboratorId: string,
    user: string
  ) {

    await this.collaboratorLinkedToUser(collaboratorId, user);

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
