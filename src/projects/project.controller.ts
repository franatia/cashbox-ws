import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Paths } from './constants/paths.enum';
import { CreateNodesDto } from './dto/create-nodes.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateNodesDto } from './dto/update-nodes.dto';
import { GetProjectQueryDto } from './dto/get-project-query.dto';
import { joinPaths } from '@/common/helpers/path.helper';
import GetProjectsQueryDto from './dto/get-projects-query.dt';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Get()
  getProjects(
    @Query() query: GetProjectsQueryDto,
    @CurrentUser() user: string
  ) {

    return this.projectService.getProjects(user, query);

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
  getProjectAndFilterNode(
    @Param("projectId", new ParseUUIDPipe()) projectId: string,
    @Param("nodeId", new ParseUUIDPipe()) nodeId : string,
    @Query() query: GetProjectQueryDto,
    @CurrentUser() user: string
  ) {
    return this.projectService.getProject(projectId, user, query, nodeId);
  }

  @Post()
  createProject(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: string) {
    return this.projectService.createProject(createProjectDto, user);
  }

  @Post(Paths.NODES)
  createNodes(@Body() createNodesDto: CreateNodesDto, @CurrentUser() user: string) {

    return this.projectService.createNodes(createNodesDto, user);

  }

  @Put(Paths.NODES)
  updateNodes(@Body() updateNodesDto: UpdateNodesDto, @CurrentUser() user: string) {

    return this.projectService.updateNodes(
      updateNodesDto,
      user
    )

  }

  @Put(":id")
  updateProject(
    @Param("id") id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: string
  ) {

    return this.projectService.updateProject(
      id,
      updateProjectDto,
      user
    )

  }

}
