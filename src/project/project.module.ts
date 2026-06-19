import { forwardRef, Module } from '@nestjs/common';
import { ProjectService } from './core/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Node } from './entities/node.entity';
import { Collaborator } from './entities/collaborator.entity';
import { CashboxModule } from '@/cashbox/cashbox.module';
import { AuthModule } from '@/auth/auth.module';
import { TaxModule } from '@/tax/tax.module';
import { StockModule } from '@/stock/stock.module';
import { ProjectController } from './core/project.controller';
import { NodeController } from './node/node.controller';
import { CollaboratorController } from './collaborator/collaborator.controller';
import { ProjectInitializer } from './core/project.initializer';
import { ProjectSearch } from './core/project.search';
import { ProjectQuery } from './core/query/project.query';
import { ProjectRelations } from './core/query/project.relations';
import { ProjectDeleter } from './core/query/project.deleter';
import { ProjectFinder } from './core/query/project.finder';
import { ProjectSaver } from './core/query/project.saver';
import { ProjectUpdater } from './core/query/project.updater';
import { CollaboratorService } from './collaborator/collaborator.service';
import { CollaboratorInitializer } from './collaborator/collaborator.initializer';
import { CollaboratorSearch } from './collaborator/collaborator.search';
import { CollaboratorQuery } from './collaborator/query/collaborator.query';
import { CollaboratorRelations } from './collaborator/query/collaborator.relations';
import { CollaboratorDeleter } from './collaborator/query/collaborator.deleter';
import { CollaboratorFinder } from './collaborator/query/collaborator.finder';
import { CollaboratorSaver } from './collaborator/query/collaborator.saver';
import { CollaboratorUpdater } from './collaborator/query/collaborator.updater';
import { NodeService } from './node/node.service';
import { NodeInitializer } from './node/node.initializer';
import { NodeSearch } from './node/node.search';
import { NodeQuery } from './node/query/node.query';
import { NodeRelations } from './node/node.relations';
import { NodeDeleter } from './node/query/node.deleter';
import { NodeFinder } from './node/query/node.finder';
import { NodeSaver } from './node/query/node.saver';
import { NodeUpdater } from './node/query/node.updater';
import { CollaboratorValidator } from './collaborator/collaborator.validator';
import { NodeEvent } from './node/event-listener/node.event';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      Project,
      Node,
      Collaborator
    ]),
    CashboxModule,
    TaxModule,
    forwardRef(() => StockModule)
  ],
  controllers: [
    NodeController,
    CollaboratorController,
    ProjectController
  ],
  providers: [

    ProjectService, 
    ProjectInitializer,
    ProjectSearch,
    ProjectQuery,
    ProjectRelations,
    ProjectDeleter,
    ProjectFinder,
    ProjectSaver,
    ProjectUpdater,

    CollaboratorService,
    CollaboratorInitializer,
    CollaboratorSearch,
    CollaboratorQuery,
    CollaboratorRelations,
    CollaboratorDeleter,
    CollaboratorFinder,
    CollaboratorSaver,
    CollaboratorUpdater,
    CollaboratorValidator,

    NodeService,
    NodeInitializer,
    NodeSearch,
    NodeQuery,
    NodeRelations,
    NodeDeleter,
    NodeFinder,
    NodeSaver,
    NodeUpdater,
    NodeEvent

  ],
  exports: [
    ProjectService,
    ProjectRelations,
    ProjectFinder,

    NodeService,
    NodeRelations,
    NodeFinder,
    
    CollaboratorService,
    CollaboratorRelations,
    CollaboratorFinder,

    TypeOrmModule,
  ]
})
export class ProjectModule { }
