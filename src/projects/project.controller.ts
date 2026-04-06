import { Controller, Get, Post, Body, Param, Put, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Paths } from './constants/paths.enum';
import { CreateNodesDto } from './dto/create-nodes.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetProjectQueryDto } from './dto/get-project-query.dto';
import { joinPaths } from '@/common/helpers/path.helper';
import GetProjectsQueryDto from './dto/get-projects-query.dt';
import { UpdateNodeDto } from './dto/update-node.dto';
import GetNodeQueryDto from './dto/get-node-query.dto';
import { create } from 'domain';
import CreateCollaboratorDto from './dto/create-collaborator.dto';
import GetCollaboratorsQueryDto from './dto/get-collaborators-query.dto';
import UpdateCollaboratorDto from './dto/update-collaborator.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto, 
    @CurrentUser() user: string
  ) {
    return this.projectService.createProject(createProjectDto, user);
  }

  @Post(Paths.NODES)
  createNodes(
    @Body() createNodesDto: CreateNodesDto, 
    @CurrentUser() user: string
  ) {

    return this.projectService.createNodes(createNodesDto, user);

  }

  @Post(Paths.COLLABORATORS)
  createCollaborator(
    @Body() createCollaboratorDto: CreateCollaboratorDto,
    @CurrentUser() user: string,
  ) {

    return this.projectService.createCollaborator(createCollaboratorDto, user);

  }

  @Get()
  getProjects(
    @Query() query: GetProjectsQueryDto,
    @CurrentUser() user: string
  ) {

    return this.projectService.getProjects(user, query);

  }

  @Get(joinPaths(Paths.NODE, Paths.PARAM_NODE_ID))
  getNode(
    @Param("nodeId", new ParseUUIDPipe()) nodeId : string,
    @Query() query: GetNodeQueryDto,
    @CurrentUser() user: string
  ){

    return this.projectService.getNode(
      nodeId,
      query,
      user
    )

  }

  @Get(Paths.COLLABORATORS)
  getCollaborators(
    @Query() query : GetCollaboratorsQueryDto,
    @CurrentUser() user : string
  ){

    return this.projectService.getCollaborators(
      query,
      user
    )

  }

  @Get(joinPaths(Paths.COLLABORATORS, Paths.PARAM_COLLABORATOR_ID))
  getCollaborator(
    @Param("collaboratorId", new ParseUUIDPipe()) collaboratorId: string,
    @CurrentUser() user : string
  ){

    return this.projectService.getCollaborator(
      collaboratorId,
      user
    )

  }

  @Get(Paths.PARAM_PROJECT_ID)
  getProject(
    @Param("projectId", new ParseUUIDPipe()) id: string,
    @Query() query: GetProjectQueryDto,
    @CurrentUser() user: string
  ) {
    return this.projectService.getProject(id, user, query);
  }

  @Get(joinPaths(Paths.PARAM_PROJECT_ID, Paths.PARAM_NODE_ID))
  getProjectAndNode(
    @Param("projectId", new ParseUUIDPipe()) projectId: string,
    @Param("nodeId", new ParseUUIDPipe()) nodeId : string,
    @CurrentUser() user: string
  ) {
    return this.projectService.getProjectAndNode(
      projectId,
      user, 
      nodeId
    );
  }

  @Put(Paths.PARAM_PROJECT_ID)
  updateProject(
    @Param("projectId", new ParseUUIDPipe()) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: string
  ) {

    return this.projectService.updateProject(
      id,
      updateProjectDto,
      user
    )

  }

  @Put(joinPaths(Paths.NODE, Paths.PARAM_NODE_ID))
  updateNode(
    @Param("nodeId", new ParseUUIDPipe()) id: string,
    @Body() updateNodeDto: UpdateNodeDto,
    @CurrentUser() user: string
  ) {

    return this.projectService.updateNode(
      id,
      updateNodeDto,
      user
    )

  }

  @Put(joinPaths(Paths.COLLABORATORS, Paths.PARAM_COLLABORATOR_ID))
  updateCollaborator(
    @Param("collaboratorId", new ParseUUIDPipe()) collaboratorId : string,
    @Body() updateCollaboratorDto : UpdateCollaboratorDto,
    @CurrentUser() user : string
  ){

    return this.projectService.updateCollaborator(
      collaboratorId,
      updateCollaboratorDto,
      user
    )

  }

}
