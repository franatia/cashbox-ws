import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cost } from './entities/cost.entity';
import { Item } from './entities/item.entity';
import Constant from './entities/constant.entity';
import Rule from './entities/rule.entity';
import ConstantController from './constant-cost/constant.controller';
import ConstantService from './constant-cost/constant.service';
import ConstantSearch from './constant-cost/constant.search';
import ConstantQuery from './constant-cost/constant.query';
import CostQuery from './core/cost.query';
import CostSearch from './core/cost.search';
import CostService from './core/cost.service';
import CostController from './core/cost.controller';
import ItemQuery from './item/item.query';
import ItemSearch from './item/item.search';
import { ItemService } from './item/item.service';
import { ItemController } from './item/item.controller';
import RuleFactory from './rule/rule.factory';
import { CostFactory } from './core/cost.factory';
import RulePersistence from './rule/rule.persistence';
import RuleQuery from './rule/query/rule.query';
import {RuleRelations} from './rule/rule.relations';
import RuleEngine from './rule/engine/rule.engine';
import { ProductModule } from '@/product/product.module';
import { RuleService } from './rule/rule.service';
import { RuleController } from './rule/rule.controller';
import { RuleSearch } from './rule/rule.search';
import { CostRelations } from './core/cost.relations';
import { ConstantRelations } from './constant-cost/constant.relations';
import { ItemRelations } from './item/item.relations';
import CostSnapshot from './entities/snapshot/snapshot.entity';
import CostItemSnapshot from './entities/snapshot/item-snapshot.entity';
import { SnapshotService } from './snapshot/core/snapshot.service';
import { SnapshotQuery } from './snapshot/core/snapshot.query';
import { SnapshotFactory } from './snapshot/core/snapshot.factory';
import { SnapshotInitializer } from './snapshot/core/snapshot.initializer';
import { ItemSnapshotService } from './snapshot/item/item-snapshot.service';
import { ItemSnapshotFactory } from './snapshot/item/item-snapshot.factory';
import { ItemSnapshotQuery } from './snapshot/item/item-snapshot.query';
import { TaxSnapshotService } from './snapshot/tax/tax-snapshot.service';
import { TaxSnapshotFactory } from './snapshot/tax/tax-snapshot.factory';
import { TaxModule } from '@/tax/tax.module';
import { RuleFindQuery } from './rule/query/rule.find.query';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      Cost,
      Item,
      Constant,
      Rule,
      CostSnapshot,
      CostItemSnapshot
    ]),
    ProductModule,
    TaxModule,
  ],
  controllers: [
    ItemController,
    RuleController,
    ConstantController, 
    CostController,
  ],
  providers: [
    CostQuery,
    CostSearch,
    CostService,
    CostFactory,
    CostRelations,

    ConstantQuery,
    ConstantSearch,
    ConstantService,
    ConstantRelations,

    ItemQuery,
    ItemSearch,
    ItemService,
    ItemRelations,

    RuleFactory,
    RulePersistence,
    RuleQuery,
    RuleFindQuery,
    RuleRelations,
    RuleService,
    RuleSearch,
    RuleEngine,

    SnapshotService,
    SnapshotQuery,
    SnapshotFactory,
    SnapshotInitializer,

    ItemSnapshotService,
    ItemSnapshotFactory,
    ItemSnapshotQuery,

    TaxSnapshotService,
    TaxSnapshotFactory

  ],
  exports : [
    CostService,
    CostRelations,

    ConstantService,
    ConstantRelations,

    RuleService,
    RuleRelations,

    ItemService,
    ItemRelations,

    SnapshotService,
    ItemSnapshotService
  ]
})
export class CostsModule {}
