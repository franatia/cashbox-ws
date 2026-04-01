import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Node } from './entities/node.entity';
import { CreateNodesDto } from './dto/create-nodes.dto';
import { CashboxService } from '@/cashbox/cashbox.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { UpdateNodesDto } from './dto/update-nodes.dto';
import { GetProjectQueryDto } from './dto/get-project-query.dto';
import GetProjectsQueryDto from './dto/get-projects-query.dt';

@Injectable()
export class ProjectService {

  constructor(

    private readonly cashboxService: CashboxService,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Node)
    private readonly nodeRepo: Repository<Node>,

    private readonly dataSource: DataSource,

  ) { }

  /* ============== VERIFY ============== */

  async projectLinkedToUser(projectId: string, userId: string) {

    const isExists = await this.projectRepo.exists({
      where: {
        id: projectId,
        owner: {
          id: userId
        }
      }
    })

    if (!isExists) throw new BadRequestException("Project does not correspond toward user");

  }

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

  async nodesLinkedToProject(nodeIds: string[], projectId) {

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

  /* ============== CREATE ============== */

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

  async createNodes(
    createNodesDto: CreateNodesDto,
    user: string
  ): Promise<{
    ids: string[]
  }> {

    const { nodes, projectId } = createNodesDto;

    await this.projectLinkedToUser(projectId, user)

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

  /* ============== UPDATE ============== */

  async updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: string
  ) {

    await this.projectLinkedToUser(id, user);

    await this.projectRepo.update(id, updateProjectDto);

  }

  async updateNode(
    id: string,
    updateNodeDto: UpdateNodeDto,
    user: string
  ) {

    await this.nodeLinkedToProject(id, user);

    const { name, projectId } = updateNodeDto;

    await this.projectLinkedToUser(projectId, user);

    await this.nodeRepo.update(id, {
      name
    })

  }

  async updateNodes(
    updateNodesDto: UpdateNodesDto,
    user: string
  ) {

    const { projectId, nodes } = updateNodesDto;

    await this.nodesLinkedToProject(
      nodes.map(({ id }) => id),
      projectId
    )

    await this.projectLinkedToUser(
      projectId,
      user
    )

    await this.dataSource.transaction(async manager => {

      for (const node of nodes) {

        const { id: nodeId, ...updatedNode } = node;

        await manager.update(
          Node,
          {
            id: nodeId
          },
          {
            ...updatedNode
          }
        )

      }

    })

  }

  /* ============== GET ============== */

  async getProjects(
    user: string,
    query: GetProjectsQueryDto
  ) {

    const { selectNodes, selectCollaborators, selectBy } = query;

    const relations = {
      ...(selectNodes && { nodes: true }),
      ...(selectCollaborators && { collaborators: true })
    }

    let projects = await this.projectRepo.find({
      where: {
        owner: {
          id: user
        }
      },
      ...(!selectBy && { relations })
    })

    if (!selectBy) return projects;

    const projectSelected = await this.projectRepo.findOne({
      where: {
        id: selectBy,
        owner: {
          id: user
        }
      },
      relations
    })

    if (!projectSelected) throw new BadRequestException("Project selected does not exists");

    return projects.map(project => (
      project.id === selectBy ? projectSelected : project
    ));

  }

  async getProject(
    projectId: string,
    user: string,
    query: GetProjectQueryDto,
    nodeId: string | null = null,
  ) {

    await this.projectLinkedToUser(projectId, user);

    if (nodeId) {
      await this.nodeLinkedToProject(nodeId, projectId);
    }

    const { selectNodes, selectCollaborators } = query;

    const qb = this.projectRepo.createQueryBuilder("project")
      .where("project.id = :projectId", { projectId })

    if (selectNodes) {
      qb.leftJoinAndSelect(
        'project.nodes',
        'node',
        nodeId ? 'node.id = :nodeId' : undefined,
        nodeId ? { nodeId } : undefined
      );
    }

    if (selectCollaborators) {

      qb.leftJoinAndSelect(
        "project.collaborators",
        "collaborator",
      );

      if (nodeId) qb.leftJoin(
        "collaborator.nodes",
        "colabNode",
        "colabNode.id = :nodeId",
        { nodeId }
      );

    }

    return qb.getOne();

  }

}
