import { Controller, Get, Post, Body, Param, Put, Query, ParseUUIDPipe, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Paths } from './constants/paths.enum';
import { CreateNodesDto } from './dto/create-nodes.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetProjectQueryDto } from './dto/get-project-query.dto';
import { joinPaths } from '@/common/helpers/path.helper';
import GetProjectsQueryDto from './dto/get-projects-query.dt';
import { UpdateNodeDto } from './dto/update-node.dto';
import GetNodeQueryDto from './dto/get-node-query.dto';
import CreateCollaboratorDto from './dto/create-collaborator.dto';
import UpdateCollaboratorDto from './dto/update-collaborator.dto';
import { AccessConfig, AccessPolicies, AtLeastNodeAccess, FirstMatchAccess, FreeNullAccess } from '@/access/decorators/access.decorator';
import { ProjectAdminPolicie } from '@/access/policies/project/admin.policie';
import { NodeAdminPolicie } from '@/access/policies/node/admin.policie';
import { NodeLitePolicie } from '@/access/policies/node/lite.policie';
import { ProjectLitePolicie } from '@/access/policies/project/lite.policie';
import GetNodePolicie from './policies/get-node.policie';
import GetProjectPolicie from './policies/get-project.policie';
import { CurrentNode, CurrentNodeOrEmpty, CurrentProject, CurrentSub } from '@/common/decorators/token.decorator';
import { SetAuthType } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { RelationsConfig, RelationsRule } from '@/relations/decorators/relations.decorator';
import { StripUndefinedPipe } from '@/common/pipes/stripe-undefined.pipe';
import GetCollaboratorsDto from './dto/get-collaborators.dto';

@Controller('projects')
export class ProjectController {
  
  constructor(private readonly projectService: ProjectService) { }

  /**
   * 
   * POST
   * 
   */

  /**
   * 
   * Crear proyecto
   * 
   * @param createProjectDto 
   * @param user 
   * @returns 
   */

  @SetAuthType(AuthType.OFF_PROJECT_CONTEXT)
  @Post()
  createProject(
    @CurrentSub() clientId: string,
    @Body() createProjectDto: CreateProjectDto
  ) {
    return this.projectService.createProject(
      clientId,
      createProjectDto
    );
  }

  /**
   * 
   * Crear nodos - Sirve para uno o varios
   * 
   * @param clientId 
   * @param createNodesDto 
   * @returns 
   */

  @RelationsConfig(
    {
      from : "sub",
      to : "context.projectId",
      rule : RelationsRule.USER_TO_PROJECT
    }
  )
  @AccessPolicies(
    ProjectAdminPolicie
  )
  @Post(Paths.NODES)
  createNodes(
    @Body() createNodesDto: CreateNodesDto,
    @CurrentProject() projectId : string
  ) {

    return this.projectService.createNodes({
      ...createNodesDto,
      projectId
    });

  }

  /**
   * 
   * Crear colaborador
   * 
   * @param clientId 
   * @param createCollaboratorDto 
   * @returns 
   */

  @RelationsConfig(
    {
      from : "nodeId?",
      to : "context.projectId",
      rule : RelationsRule.NODE_TO_PROJECT
    }
  )
  @AccessPolicies(
    NodeAdminPolicie,
    ProjectAdminPolicie
  )
  @AccessConfig(
    FirstMatchAccess
  )
  @Post(Paths.COLLABORATORS)
  createCollaborator(
    @CurrentSub() clientId: string,
    @CurrentProject() projectId : string,
    @CurrentNodeOrEmpty() nodeId : string | undefined,
    @Body() dto: CreateCollaboratorDto,
  ){

    const {
      nodeId : dtoNodeId,
      ...rest
    } = dto;

    return this.projectService.createCollaborator({
      clientId,
      projectId,
      nodeId : nodeId ? nodeId : dtoNodeId,
      ...rest
    });

  }

  /**
   * 
   * PUT
   * 
   */

  /**
   * 
   * Editar nodo
   * 
   * @param clientId 
   * @param nodeId 
   * @param dto 
   * @returns 
   */

  @AccessPolicies(
    NodeAdminPolicie
  )
  @Put(Paths.NODES)
  updateNodeByContext(
    @CurrentNode() nodeId: string,
    @Body(new StripUndefinedPipe) dto: UpdateNodeDto,
  ) {

    return this.projectService.updateNode(
      nodeId,
      dto
    )

  }

  /**
   * 
   * @param dto 
   */

  @RelationsConfig(
    {
      from : "nodeId",
      to : "context.projectId",
      rule : RelationsRule.NODE_TO_PROJECT
    }
  )
  @AccessPolicies(
    ProjectAdminPolicie
  )
  @Put(joinPaths(Paths.NODES, Paths.PARAM_NODE_ID))
  updateNodeById(
    @Body(new StripUndefinedPipe()) dto : UpdateNodeDto,
    @Param("nodeId", new ParseUUIDPipe()) nodeId : string
  ){
    return this.projectService.updateNode(
      nodeId,
      dto
    )
  }

  /**
   * 
   * Editar colaborador
   * 
   * @param clientId 
   * @param collaboratorId 
   * @param dto 
   * @returns 
   */

  @RelationsConfig(
    {
      from : "collaboratorId",
      to : "context.projectId",
      rule : RelationsRule.COLLABORATOR_TO_PROJECT
    },
    {
      from : "collaboratorId",
      to : "context.nodeId?",
      rule : RelationsRule.COLLABORATOR_TO_NODE
    },
    {
      from : "collaboratorId",
      to : "sub",
      rule : RelationsRule.COLLABORATOR_NOT_LINKED_TO_USER
    }
  )
  @AccessPolicies(
    NodeAdminPolicie,
    ProjectAdminPolicie
  )
  @AccessConfig(
    FirstMatchAccess
  )
  @Put(joinPaths(Paths.COLLABORATORS, Paths.PARAM_COLLABORATOR_ID))
  updateCollaborator(
    @Param("collaboratorId", new ParseUUIDPipe()) collaboratorId : string,
    @Body() dto : UpdateCollaboratorDto
  ){

    return this.projectService.updateCollaborator(
      collaboratorId,
      dto
    )

  }

  /**
   * 
   * Editar proyecto
   * 
   * @param clientId 
   * @param projectId 
   * @param dto 
   * @returns 
   */

  @AccessPolicies(
    ProjectAdminPolicie
  )
  @Put()
  updateProject(
    @CurrentProject() projectId : string,
    @Body() dto: UpdateProjectDto,
  ) {

    return this.projectService.updateProject(
      projectId,
      dto
    )

  }

  /**
   * 
   * DELETE
   * 
   */

  /**
   * 
   * Eliminar nodo
   * 
   * @param clientId 
   * @param nodeId 
   * @returns 
   */

  @AccessPolicies(
    ProjectAdminPolicie
  )
  @Delete(joinPaths(Paths.NODES, Paths.PARAM_NODE_ID))
  deleteNode(
    @Param("nodeId") nodeId : string
  ){

    return this.projectService.deleteNode(
      nodeId
    )

  }

  /**
   * 
   * Eliminar colaborador
   * 
   * @param clientId 
   * @param collaboratorId 
   * @param dto 
   * @returns 
   */

  @RelationsConfig(
    {
      from : "collaboratorId",
      to : "context.projectId",
      rule : RelationsRule.COLLABORATOR_TO_PROJECT
    },
    {
      from : "collaboratorId",
      to : "context.nodeId?",
      rule : RelationsRule.COLLABORATOR_TO_NODE
    }
  )
  @AccessPolicies(
    NodeAdminPolicie,
    ProjectAdminPolicie
  )
  @AccessConfig(
    FirstMatchAccess
  )
  @Delete(joinPaths(Paths.COLLABORATORS, Paths.PARAM_COLLABORATOR_ID))
  deleteCollaborator(
    @Param("collaboratorId") id : string,
  ){

    return this.projectService.deleteCollaborator(
      id
    )

  }

  /**
   * 
   * Eliminar proyecto
   * 
   * @param clientId 
   * @param projectId 
   * @returns 
   */

  @AccessPolicies(
    ProjectAdminPolicie
  )
  @Delete()
  deleteProject(
    @CurrentProject() projectId : string
  ){ 

    return this.projectService.deleteProject(
      projectId
    )

  }

  /**
   * 
   * GET
   * 
   */
  
  /**
   * 
   * Obtener nodo
   * 
   * @param clientId 
   * @param nodeId 
   * @param query 
   * @returns 
   */

  @AccessPolicies(
    GetNodePolicie
  )
  @AccessConfig(
    AtLeastNodeAccess
  )
  @Get(Paths.NODES)
  getNodeByContext(
    @CurrentNodeOrEmpty() nodeId : string | undefined,
    @CurrentProject() projectId : string,
    @Query() query: GetNodeQueryDto
  ){

    return this.projectService.getNodes(
      projectId,
      query,
      nodeId
    )

  }

  /**
   * 
   * Obtener nodo
   * 
   * @param clientId 
   * @param nodeId 
   * @param query 
   * @returns 
   */

  @RelationsConfig(
    {
      from : "nodeId",
      to : "context.projectId",
      rule : RelationsRule.NODE_TO_PROJECT
    }
  )
  @AccessPolicies(
    GetNodePolicie
  )
  @Get(joinPaths(Paths.NODES, Paths.PARAM_NODE_ID))
  getNodeById(
    @Param("nodeId", new ParseUUIDPipe()) nodeId : string,
    @Query() query: GetNodeQueryDto
  ){

    return this.projectService.getNode(
      nodeId,
      query
    )

  }

  /**
   * 
   * Obtener colaboradores relacionados al cliente
   * segun un selector de nodo o proyecto
   * 
   * @param clientId 
   * @param query 
   * @returns 
   */

  @RelationsConfig(
    {
      from : "nodeSelector?",
      to : "context.projectId",
      rule : RelationsRule.NODE_TO_PROJECT
    }
  )
  @AccessPolicies(
    NodeLitePolicie,
    ProjectLitePolicie
  )
  @AccessConfig(
    FirstMatchAccess
  )
  @Get(Paths.COLLABORATORS)
  getCollaborators(
    @CurrentNodeOrEmpty() nodeId : string | undefined,
    @CurrentProject() projectId : string,
    @Query() dto : GetCollaboratorsDto
  ){

    return this.projectService.getCollaborators({
      nodeId : nodeId ? nodeId : dto.nodeSelector,
      projectId
    })

  }

  /**
   * 
   * Obtener colaborador
   * 
   * @param clientId 
   * @param collaboratorId 
   * @returns 
   */

  @RelationsConfig(
    {
      from : "collaboratorId",
      to : "context.projectId",
      rule : RelationsRule.COLLABORATOR_TO_PROJECT
    },
    {
      from : "collaboratorId",
      to : "context.nodeId?",
      rule : RelationsRule.COLLABORATOR_TO_NODE
    }
  )
  @Get(joinPaths(Paths.COLLABORATORS, Paths.PARAM_COLLABORATOR_ID))
  getCollaborator(
    @Param("collaboratorId", new ParseUUIDPipe()) collaboratorId: string
  ){

    return this.projectService.getCollaborator(
      collaboratorId
    )

  }

  /**
   * 
   * Obtener proyecto
   * 
   * @param clientId 
   * @param projectId 
   * @param query 
   * @returns 
   */

  @AccessPolicies(
    NodeLitePolicie
  )
  @AccessConfig(FreeNullAccess)
  @Get()
  getProjects(
    @CurrentSub() clientId: string,
    @Query() query: GetProjectsQueryDto
  ) {

    return this.projectService.getProjects(
      clientId, 
      query
    );

  }

  @RelationsConfig(
    {
      from : "sub",
      to : "projectId",
      rule : RelationsRule.USER_TO_PROJECT
    }
  )
  @SetAuthType(
    AuthType.OFF_PROJECT_CONTEXT
  )
  @Get(Paths.PARAM_PROJECT_ID)
  getProjectById(
    @CurrentSub() clientId: string,
    @Param("projectId", new ParseUUIDPipe()) projectId : string,
    @Query() query: GetProjectQueryDto,
  ) {

    return this.projectService.getProject(
      clientId,
      projectId,
      query
    );
  }

}
