import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsLinkerController } from './movements-linker/movements-linker.controller';
import { MovementController } from './movement/movement.controller';
import LotController from './lot/lot.controller';
import { ItemController } from './item/item.controller';
import TransferController from './transfer/transfer.controller';
import { TransferItemController } from './transfer-item/transfer-item.controller';
import StockController from './core/stock.controller';
import { MovementsLinkerService } from './movements-linker/movements-linker.service';
import { MovementsLinkerSearch } from './movements-linker/movements-linker.search';
import { MovementsLinkerRelations } from './movements-linker/movements-linker.relations';
import MovementsLinkerQuery from './movements-linker/movements-linker.query';
import { MovementService } from './movement/movement.service';
import { MovementRelations } from './movement/movement.relations';
import { MovementSearch } from './movement/movement.search';
import { MovementQuery } from './movement/movement.query';
import { MovementFactory } from './movement/movement.factory';
import { LotService } from './lot/lot.service';
import { LotRelations } from './lot/lot.relations';
import LotSearch from './lot/lot.search';
import { LotQuery } from './lot/lot.query';
import { LotFactory } from './lot/lot.factory';
import { ItemService } from './item/item.service';
import { ItemRelations } from './item/item.relations';
import { ItemSearch } from './item/item.search';
import { ItemQuery } from './item/item.query';
import { ItemFactory } from './item/item.factory';
import TransferService from './transfer/transfer.service';
import { TransferRelations } from './transfer/transfer.relations';
import { TransferSearch } from './transfer/transfer.search';
import { TransferQuery } from './transfer/transfer.query';
import { TransferItemService } from './transfer-item/transfer-item.service';
import { TransferItemRelations } from './transfer-item/transfer-item.relations';
import { TransferItemSearch } from './transfer-item/transfer-item.search';
import { TransferItemQuery } from './transfer-item/transfer-item.query';
import { TransferItemFactory } from './transfer-item/transfer-item.factory';
import { StockSearch } from './core/stock.search';
import { StockService } from './core/stock.service';
import { StockRelations } from './core/stock.relations';
import { StockQuery } from './core/query/stock.query';
import { Stock } from './entities/stock.entity';
import { Item } from './entities/item.entity';
import { Lot } from './entities/lot/lot.entity';
import { Movement } from './entities/movement.entity';
import { MovementsLinker } from './entities/transfer/movements-linker.entity';
import { Transfer } from './entities/transfer/transfer.entity';
import { TransferItem } from './entities/transfer/transfer-item.entity';
import { LotAccumulatedView } from './entities/lot/lot-accumulated.view';
import { LotAccumulatedService } from './lot-accumulated/lot-accumulated.service';
import { LotAccumulatedQuery } from './lot-accumulated/lot-accumulated.query';
import { ConceptualMovement } from './entities/conceptual-movement.entity';
import { ProjectModule } from '@/project/project.module';
import { StockEvent } from './core/event-listener/stock.event';
import { StockListener } from './core/event-listener/stock.listener';
import { ItemListener } from './item/event-listener/item.listener';
import { StockPagination } from './core/query/stock.pagination';
import { LotEvent } from './lot/event-listener/lot.event';
import { ItemEvent } from './item/event-listener/item.event';
import { StockFactory } from './core/stock.factory';
import { CostsModule } from '@/costs/costs.module';
import { LotInitializer } from './lot/lot.initializer';
import { TransferFinder } from './transfer/query/transfer.finder';
import { MovementsLinkerFinder } from './movements-linker/query/movements-linker.finder';
import { LotFinder } from './lot/query/lot.finder';
import { ItemFinder } from './item/query/item.finder';
import { TransferItemFinder } from './transfer-item/query/transfer-item.finder';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stock,
      Item,
      Lot,
      Movement,
      ConceptualMovement,
      MovementsLinker,
      Transfer,
      TransferItem,
      LotAccumulatedView
    ]),
    forwardRef(() => ProjectModule),
    forwardRef(() => CostsModule),
  ],
  controllers: [
    MovementsLinkerController,
    MovementController,
    LotController,
    ItemController,
    TransferController,
    TransferItemController,
    StockController
  ],
  providers: [
    MovementsLinkerService,
    MovementsLinkerRelations,
    MovementsLinkerSearch,
    MovementsLinkerQuery,
    MovementsLinkerFinder,

    MovementService,
    MovementRelations,
    MovementSearch,
    MovementQuery,
    MovementFactory,

    LotService,
    LotRelations,
    LotSearch,
    LotQuery,
    LotFactory,
    LotEvent,
    LotInitializer,
    LotFinder,

    LotAccumulatedService,
    LotAccumulatedQuery,

    ItemService,
    ItemRelations,
    ItemSearch,
    ItemQuery,
    ItemFactory,
    ItemListener,
    ItemEvent,
    ItemFinder,

    TransferService,
    TransferRelations,
    TransferSearch,
    TransferQuery,
    TransferFinder,
    
    TransferItemService,
    TransferItemRelations,
    TransferItemSearch,
    TransferItemQuery,
    TransferItemFactory,
    TransferItemFinder,

    StockSearch,
    StockService,
    StockRelations,
    StockQuery,
    StockEvent,
    StockListener,
    StockPagination,
    StockFactory,
  ],
  exports : [
    MovementsLinkerService,
    MovementsLinkerQuery,
    MovementsLinkerRelations,

    MovementService,
    MovementQuery,
    MovementRelations,

    LotService,
    LotQuery,
    LotRelations,

    TransferService,
    TransferQuery,
    TransferRelations,

    TransferItemService,
    TransferItemQuery,
    TransferItemRelations,

    ItemService,
    ItemQuery,
    ItemRelations,

    StockService,
    StockQuery,
    StockRelations
  ]
})
export class StockModule { }
