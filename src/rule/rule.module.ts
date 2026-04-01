import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { RuleCondition } from './entities/rule-condition.entity';
import { RuleEffect } from './entities/rule-effect.entity';
import { RuleEffectSelector } from './entities/rule-effect-selector.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rule, RuleCondition, RuleEffect, RuleEffectSelector])
  ],
  controllers: [RuleController],
  providers: [RuleService],
})
export class RuleModule { }
