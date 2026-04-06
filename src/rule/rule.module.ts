import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { RuleCondition } from './entities/rule-condition.entity';
import { RuleEffect } from './entities/rule-effect.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rule, RuleCondition, RuleEffect])
  ],
  controllers: [RuleController],
  providers: [RuleService],
})
export class RuleModule { }
