import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Node } from './entities/node.entity';
import { Collaborator } from './entities/collaborator.entity';
import { CashboxModule } from '@/cashbox/cashbox.module';
import { AuthModule } from '@/auth/auth.module';
import {ProjectServiceQuery} from './query/project.service.query';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Node, Collaborator]),
    CashboxModule,
    AuthModule
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectServiceQuery],
  exports: [ProjectService]
})
export class ProjectModule {}
