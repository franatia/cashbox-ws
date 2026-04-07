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
import GetCollaboratorsQueryDto from './dto/get-collaborators-query.dto';
import UpdateCollaboratorDto from './dto/update-collaborator.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import DeleteCollaboratorDto from './dto/delete-collaborator.dto';

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

  @Post()
  createProject(
    @CurrentUser() clientId: string,
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

  @Post(Paths.NODES)
  createNodes(
    @CurrentUser() clientId: string,
    @Body() createNodesDto: CreateNodesDto
  ) {

    return this.projectService.createNodes(
      clientId,
      createNodesDto
    );

  }

  /**
   * 
   * Crear colaborador
   * 
   * @param clientId 
   * @param createCollaboratorDto 
   * @returns 
   */

  @Post(Paths.COLLABORATORS)
  createCollaborator(
    @CurrentUser() clientId: string,
    @Body() createCollaboratorDto: CreateCollaboratorDto,
  ) {

    return this.projectService.createCollaborator(
      clientId,
      createCollaboratorDto
    );

  }

  /**
   * 
   * Editar nodo
   * 
   * @param clientId 
   * @param nodeId 
   * @param dto 
   * @returns 
   */

  @Put(joinPaths(Paths.NODES, Paths.PARAM_NODE_ID))
  updateNode(
    @CurrentUser() clientId: string,
    @Param("nodeId", new ParseUUIDPipe()) nodeId: string,
    @Body() dto: UpdateNodeDto,
  ) {

    return this.projectService.updateNode(
      clientId,
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

  @Put(joinPaths(Paths.COLLABORATORS, Paths.PARAM_COLLABORATOR_ID))
  updateCollaborator(
    @CurrentUser() clientId : string,
    @Param("collaboratorId", new ParseUUIDPipe()) collaboratorId : string,
    @Body() dto : UpdateCollaboratorDto
  ){

    return this.projectService.updateCollaborator(
      clientId,
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

  @Put(Paths.PARAM_PROJECT_ID)
  updateProject(
    @CurrentUser() clientId: string,
    @Param("projectId", new ParseUUIDPipe()) projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {

    return this.projectService.updateProject(
      clientId,
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

  @Delete(joinPaths(Paths.NODES, Paths.PARAM_NODE_ID))
  deleteNode(
    @CurrentUser() clientId : string,
    @Param("nodeId") nodeId : string
  ){

    return this.projectService.deleteNode(
      clientId,
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

  @Delete(joinPaths(Paths.COLLABORATORS, Paths.PARAM_COLLABORATOR_ID))
  deleteCollaborator(
    @CurrentUser() clientId : string,
    @Param("collaboratorId") collaboratorId : string,
    @Body() dto : DeleteCollaboratorDto
  ){

    return this.projectService.deleteCollaborator(
      clientId,
      collaboratorId,
      dto
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

  @Delete(Paths.PARAM_PROJECT_ID)
  deleteProject(
    @CurrentUser() clientId : string,
    @Param("projectId") projectId : string
  ){

    return this.projectService.deleteProject(
      clientId,
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
   * Obtener proyectos por cliente
   * 
   * @param clientId 
   * @param query 
   * @returns 
   */

  @Get()
  getProjects(
    @CurrentUser() clientId: string,
    @Query() query: GetProjectsQueryDto
  ) {

    return this.projectService.getProjects(
      clientId, 
      query
    );

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

  @Get(joinPaths(Paths.NODES, Paths.PARAM_NODE_ID))
  getNode(
    @CurrentUser() clientId: string,
    @Param("nodeId", new ParseUUIDPipe()) nodeId : string,
    @Query() query: GetNodeQueryDto
  ){

    return this.projectService.getNode(
      clientId,
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

  @Get(Paths.COLLABORATORS)
  getCollaborators(
    @CurrentUser() clientId : string,
    @Query() query : GetCollaboratorsQueryDto
  ){

    return this.projectService.getCollaborators(
      clientId,
      query
    )

  }

  /**
   * 
   * Obtener colaborador
   * 
   * @param clientId 
   * @param collaboratorId 
   * @returns 
   */

  @Get(joinPaths(Paths.COLLABORATORS, Paths.PARAM_COLLABORATOR_ID))
  getCollaborator(
    @CurrentUser() clientId : string,
    @Param("collaboratorId", new ParseUUIDPipe()) collaboratorId: string
  ){

    return this.projectService.getCollaborator(
      clientId,
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

  @Get(Paths.PARAM_PROJECT_ID)
  getProject(
    @CurrentUser() clientId: string,
    @Param("projectId", new ParseUUIDPipe()) projectId: string,
    @Query() query: GetProjectQueryDto,
  ) {
    return this.projectService.getProject(
      clientId,
      projectId,
      query
    );
  }

}
