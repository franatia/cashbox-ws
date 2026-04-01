import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Node } from './entities/node.entity';
import { Collaborator } from './entities/collaborator.entity';
import { CashboxModule } from '@/cashbox/cashbox.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Node, Collaborator]),
    CashboxModule
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}
