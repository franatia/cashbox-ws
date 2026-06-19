import { Module } from '@nestjs/common';
import { ComposityService } from './composity.service';
import { ComposityController } from './composity.controller';

@Module({
  controllers: [ComposityController],
  providers: [ComposityService],
})
export class ComposityModule {}
