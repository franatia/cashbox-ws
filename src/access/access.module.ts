import { forwardRef, Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';
import { ProjectModule } from '@/projects/project.module';
import { AccessGuard } from './guards/access.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    forwardRef(() => ProjectModule)
  ],
  controllers: [AccessController],
  providers: [
    AccessService,
    {
      provide: APP_GUARD,
      useClass: AccessGuard
    }
  ],
  exports: [AccessService]
})
export class AccessModule { }
