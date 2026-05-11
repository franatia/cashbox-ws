import { Module } from '@nestjs/common';
import { RelationsGuard } from './relations.guard';
import { APP_GUARD } from '@nestjs/core';
import { RelationsEngine } from './relations.engine';
import { ProjectModule } from '@/projects/project.module';
import { ProductModule } from '@/product/product.module';

@Module({
  imports: [
    ProjectModule,
    ProductModule
  ],
  providers: [
    RelationsGuard,
    {
      provide: APP_GUARD,
      useClass: RelationsGuard
    },
    RelationsEngine,
  ],
  exports: [
    RelationsEngine
  ]
})
export class RelationsModule { }
